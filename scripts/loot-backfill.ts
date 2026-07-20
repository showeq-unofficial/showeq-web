// Backfill loot from an offline .pbstream capture (daemon FileSink format:
// repeating 4-byte little-endian length + serialized seq.v1.Envelope). Feeds the
// same recorder core as the live host, so history from old captures lands in the
// same DB. Also the fast, deterministic re-test path for the pipeline.
//
//   bun scripts/loot-backfill.ts <file.pbstream> [--db PATH]
import { fromBinary } from '@bufbuild/protobuf';
import { EnvelopeSchema } from '../src/gen/seq/v1/events_pb';
import { LootRecorderCore } from '../src/recorder/core';
import { BunSqliteSink } from './bun-sink';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const file = process.argv[2];
if (!file || file.startsWith('--')) {
  console.error('usage: bun scripts/loot-backfill.ts <file.pbstream> [--db PATH]');
  process.exit(1);
}
const dbIdx = process.argv.indexOf('--db');
const dbPath = dbIdx >= 0 ? process.argv[dbIdx + 1] : join(homedir(), '.showeq', 'loot.db');

const buf = readFileSync(file);
const sink = new BunSqliteSink(dbPath);
const core = new LootRecorderCore(sink);

let off = 0;
let envs = 0;
while (off + 4 <= buf.length) {
  const len = buf.readUInt32LE(off);
  off += 4;
  if (len === 0 || off + len > buf.length) break;
  try {
    core.applyEnvelope(fromBinary(EnvelopeSchema, buf.subarray(off, off + len)));
    envs++;
  } catch {
    // skip a malformed record and keep going
  }
  off += len;
}

console.log(`ingested ${envs} envelopes → ${core.count()} loot rows → ${dbPath}`);
sink.close();
