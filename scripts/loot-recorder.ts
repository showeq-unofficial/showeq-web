// Standalone Bun host for the loot recorder (browser users; the Tauri build
// records in-app via src/state/lootRecorder.ts instead). Subscribes to the
// daemon's protobuf WebSocket, feeds envelopes through the shared recorder core
// (src/recorder/core.ts), and persists to a bun:sqlite DB.
//
//   bun scripts/loot-recorder.ts [ws://host:port] [--db PATH] [--looter NAME]
//                                [--serve-port N | --no-serve]
//
// Defaults: ws://localhost:9090, ~/.showeq/loot.db, HTTP query API on :9092
// (for the web loot view). Ctrl-C to stop.
import { create, fromBinary, toBinary } from '@bufbuild/protobuf';
import { EnvelopeSchema } from '../src/gen/seq/v1/events_pb';
import { ClientEnvelopeSchema, SubscribeSchema, Topic } from '../src/gen/seq/v1/client_pb';
import { LootRecorderCore } from '../src/recorder/core';
import { BunSqliteSink } from './bun-sink';
import { startLootServer } from './loot-server';
import { homedir } from 'node:os';
import { join } from 'node:path';

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const url = process.argv[2]?.startsWith('ws') ? process.argv[2] : 'ws://localhost:9090';
const dbPath = arg('--db') ?? join(homedir(), '.showeq', 'loot.db');
const looter = arg('--looter') ?? '';
const servePort = process.argv.includes('--no-serve') ? 0 : Number(arg('--serve-port')) || 9092;

const sink = new BunSqliteSink(dbPath);
const core = new LootRecorderCore(sink, looter);
console.log(`loot-recorder → ${url}   db=${dbPath}`);
if (servePort) {
  startLootServer(dbPath, servePort);
  console.log(`loot API      → http://localhost:${servePort}/api/loot`);
}

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
      core.applyEnvelope(fromBinary(EnvelopeSchema, new Uint8Array(ev.data)));
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
  core.flush();
  console.log(`\nrecorded ${core.count()} loot rows → ${dbPath}`);
  sink.close();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

connect();
