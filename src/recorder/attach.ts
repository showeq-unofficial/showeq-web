// Wires an envelope stream to a LootRecorderCore whose sink is opened LAZILY,
// once the first Snapshot reveals the daemon's data namespace — so EQL loot
// lands in ~/.showeq/eql/loot.db and Live in ~/.showeq/loot.db, automatically,
// with no flags (works for both the Bun host and the Tauri app). Envelopes that
// arrive before the sink is ready are buffered (loot events always follow the
// initial Snapshot, so nothing is lost). Shared by both hosts so the routing
// rule lives in exactly one place.
import { LootRecorderCore } from './core';
import type { LootSink } from './loot';
import type { Envelope } from '@gen/seq/v1/events_pb';

export interface ClosableSink extends LootSink {
  close?(): void | Promise<void>;
}

export function attachRecorder(
  subscribe: (fn: (env: Envelope) => void) => () => void,
  // Given the daemon's namespace (e.g. ".showeq" or ".showeq/eql"), open the
  // sink for ~/<namespace>/loot.db (create dir + schema).
  openSink: (namespace: string) => Promise<ClosableSink> | ClosableSink,
  onOpen?: (namespace: string) => void,
  looter = '',
): () => void {
  let core: LootRecorderCore | null = null;
  let sink: ClosableSink | null = null;
  let opening = false;
  const buffer: Envelope[] = [];

  const unsub = subscribe((env) => {
    if (core) { core.applyEnvelope(env); return; }
    buffer.push(env);
    if (opening || env.payload.case !== 'snapshot') return;
    opening = true;
    const ns = env.payload.value.dataNamespace || '.showeq';
    Promise.resolve(openSink(ns))
      .then((s) => {
        sink = s;
        core = new LootRecorderCore(s, looter);
        for (const e of buffer.splice(0)) core.applyEnvelope(e);
        onOpen?.(ns);
      })
      .catch((e) => console.error('loot recorder: failed to open sink', e));
  });

  return () => {
    unsub();
    core?.flush();
    void sink?.close?.();
  };
}
