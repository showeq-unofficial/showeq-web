/**
 * Daemon smoke test. Runs the daemon (expected to already be started on
 * ws://localhost:19090), sends a Subscribe, asserts a Snapshot Envelope
 * comes back. Prints the snapshot contents and exits 0 on success.
 *
 * Usage:
 *   pnpm run smoke          # wraps `tsx scripts/smoke-test.ts`
 *   SEQ_URL=ws://host:port pnpm run smoke
 *
 * This is a developer convenience, not part of the CI flow yet.
 */
import WebSocket from 'ws';
import { create, fromBinary, toBinary } from '@bufbuild/protobuf';
import { ClientEnvelopeSchema, SubscribeSchema, Topic } from '../src/gen/seq/v1/client_pb';
import { EnvelopeSchema } from '../src/gen/seq/v1/events_pb';

const URL = process.env.SEQ_URL ?? 'ws://127.0.0.1:19090';

const ws = new WebSocket(URL);

ws.on('open', () => {
  const env = create(ClientEnvelopeSchema, {
    payload: {
      case: 'subscribe',
      value: create(SubscribeSchema, {
        topics: [Topic.SPAWNS, Topic.ZONE, Topic.PLAYER],
      }),
    },
  });
  ws.send(toBinary(ClientEnvelopeSchema, env));
});

ws.on('message', (data) => {
  const bytes = data instanceof Buffer ? new Uint8Array(data) : new Uint8Array();
  const env = fromBinary(EnvelopeSchema, bytes);
  console.log(`seq=${env.seq} payload=${env.payload.case}`);
  if (env.payload.case === 'snapshot') {
    const s = env.payload.value;
    console.log(`  zone_short=${s.zoneShort} spawns=${s.spawns.length}`);
    ws.close();
    process.exit(0);
  }
});

ws.on('error', (e) => {
  console.error('ws error:', e);
  process.exit(2);
});

setTimeout(() => {
  console.error('timed out waiting for Snapshot');
  process.exit(3);
}, 3_000);
