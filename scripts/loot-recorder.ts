// Standalone Bun host for the loot recorder (browser users; the Tauri build
// records in-app via src/state/lootRecorder.ts instead). Subscribes to the
// daemon's protobuf WebSocket, feeds envelopes through the shared recorder core,
// and persists to a bun:sqlite DB. The DB is chosen per backend from the
// daemon's data namespace in the first Snapshot (~/.showeq/loot.db for Live,
// ~/.showeq/eql/loot.db for EQL) unless --db overrides it.
//
//   bun scripts/loot-recorder.ts [ws://host:port] [--db PATH]
//                                [--serve-port N | --no-serve] [--looter NAME]
//
// Defaults: ws://localhost:9090, per-namespace DB, HTTP query API on :9092.
import { create, fromBinary, toBinary } from '@bufbuild/protobuf';
import { EnvelopeSchema, type Envelope } from '../src/gen/seq/v1/events_pb';
import { ClientEnvelopeSchema, SubscribeSchema, Topic } from '../src/gen/seq/v1/client_pb';
import { attachRecorder } from '../src/recorder/attach';
import { BunSqliteSink } from './bun-sink';
import { startLootServer } from './loot-server';
import { mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const url = process.argv[2]?.startsWith('ws') ? process.argv[2] : 'ws://localhost:9090';
const explicitDb = arg('--db');
const looter = arg('--looter') ?? '';
const servePort = process.argv.includes('--no-serve') ? 0 : Number(arg('--serve-port')) || 9092;

console.log(`loot-recorder → ${url}`);

// Open the per-namespace DB (or the --db override) once the first Snapshot
// reveals the daemon's backend, and start the read API on that same DB.
let apiStarted = false;
function openSink(namespace: string): BunSqliteSink {
  const dbPath = explicitDb ?? join(homedir(), namespace, 'loot.db');
  mkdirSync(dirname(dbPath), { recursive: true });
  const sink = new BunSqliteSink(dbPath);
  console.log(`recording → ${dbPath}`);
  if (servePort && !apiStarted) {
    startLootServer(dbPath, servePort);
    apiStarted = true;
    console.log(`loot API   → http://localhost:${servePort}/api/loot`);
  }
  return sink;
}

// The WS reconnects internally; keep a single envelope listener across reconnects.
let listener: ((env: Envelope) => void) | null = null;
const stop = attachRecorder((fn) => { listener = fn; return () => { listener = null; }; }, openSink, undefined, looter);

let backoff = 250;
let stopping = false;

function connect(): void {
  const ws = new WebSocket(url);
  ws.binaryType = 'arraybuffer';
  ws.onopen = () => {
    backoff = 250;
    const env = create(ClientEnvelopeSchema, {
      payload: {
        case: 'subscribe',
        value: create(SubscribeSchema, { topics: [Topic.SPAWNS, Topic.ZONE, Topic.CHAT, Topic.PLAYER] }),
      },
    });
    ws.send(toBinary(ClientEnvelopeSchema, env));
    console.log('connected, subscribed');
  };
  ws.onmessage = (ev) => {
    if (!(ev.data instanceof ArrayBuffer)) return;
    try {
      listener?.(fromBinary(EnvelopeSchema, new Uint8Array(ev.data)));
    } catch (e) {
      console.warn('decode error', e);
    }
  };
  ws.onerror = () => ws.close();
  ws.onclose = () => {
    if (stopping) return;
    setTimeout(connect, backoff);
    backoff = Math.min(backoff * 2, 5_000);
  };
}

function shutdown(): void {
  if (stopping) return;
  stopping = true;
  stop();   // flush the recorder + close the sink
  console.log('\nstopped');
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

connect();
