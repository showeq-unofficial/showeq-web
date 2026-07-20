// Tauri desktop in-app loot recorder. The browser build records via the
// standalone Bun host (scripts/loot-recorder.ts); the packaged desktop app has
// no such process, so it feeds its OWN daemon envelope stream (the same one the
// map/spawn views consume) through the shared recorder core and persists to
// ~/.showeq/loot.db via tauri-plugin-sql. Active only under Tauri — App wires it
// behind isTauri().
import { LootRecorderCore } from '@/recorder/core';
import type { LootRow, LootSink } from '@/recorder/loot';
import { SCHEMA } from '@/recorder/schema';
import type { Envelope } from '@gen/seq/v1/events_pb';
import type Database from '@tauri-apps/plugin-sql';

const INSERT = `INSERT INTO loot
  (ts, source, item_name, item_id, icon, qty, mob_name, mob_norm, corpse_id,
   zone_short, zone_base, instance, sold, money_copper, disposition, looter)
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`;

// Open (or reuse) the plugin-sql handle to ~/.showeq/loot.db. Dynamic imports
// keep the tauri-only modules out of the browser bundle.
export async function loadLootDb(): Promise<Database> {
  const { default: SqlDatabase } = await import('@tauri-apps/plugin-sql');
  const { homeDir, join } = await import('@tauri-apps/api/path');
  return SqlDatabase.load(`sqlite:${await join(await homeDir(), '.showeq', 'loot.db')}`);
}

// Subscribe the shared core to `onEnvelope` and persist its rows via plugin-sql.
// Returns a stop() that unsubscribes and flushes a trailing pending row.
export async function startTauriLootRecorder(
  onEnvelope: (fn: (env: Envelope) => void) => () => void,
): Promise<() => void> {
  const db = await loadLootDb();
  for (const stmt of SCHEMA.split(';').map((s) => s.trim()).filter(Boolean)) {
    await db.execute(stmt);
  }

  // plugin-sql writes are async but the core writes synchronously, so queue and
  // drain in order (loot events are infrequent, the queue stays tiny).
  const queue: LootRow[] = [];
  let draining = false;
  const drain = async () => {
    if (draining) return;
    draining = true;
    while (queue.length) {
      const r = queue.shift()!;
      await db.execute(INSERT, [
        r.ts, r.source, r.itemName, r.itemId, r.icon, r.qty, r.mobName, r.mobNorm,
        r.corpseId, r.zoneShort, r.zoneBase, r.instance, r.sold, r.moneyCopper,
        r.disposition, r.looter,
      ]);
    }
    draining = false;
  };
  const sink: LootSink = { write: (rows) => { queue.push(...rows); void drain(); } };

  const core = new LootRecorderCore(sink);
  const unsub = onEnvelope((env) => core.applyEnvelope(env));
  return () => { unsub(); core.flush(); };
}
