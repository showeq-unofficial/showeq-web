// Tauri desktop in-app loot recorder. The browser build records via the
// standalone Bun host (scripts/loot-recorder.ts); the packaged desktop app has
// no such process, so it feeds its OWN daemon envelope stream (the same one the
// map/spawn views consume) through the shared recorder core and persists via
// tauri-plugin-sql. The DB is chosen per backend from the daemon's data
// namespace (~/.showeq/loot.db for Live, ~/.showeq/eql/loot.db for EQL), so EQL
// and Live loot stay separate. Active only under Tauri — App wires it behind
// isTauri().
import { attachRecorder, type ClosableSink } from '@/recorder/attach';
import { setLootNamespace } from '@/lib/lootApi';
import type { LootRow } from '@/recorder/loot';
import { SCHEMA } from '@/recorder/schema';
import type { Envelope } from '@gen/seq/v1/events_pb';
import type Database from '@tauri-apps/plugin-sql';

const INSERT = `INSERT INTO loot
  (ts, source, item_name, item_id, icon, qty, mob_name, mob_norm, corpse_id,
   zone_short, zone_base, instance, sold, money_copper, disposition, looter)
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`;

// Open ~/<namespace>/loot.db via plugin-sql and return a queued write sink.
// Dynamic imports keep the tauri-only modules out of the browser bundle.
async function makeTauriSink(namespace: string): Promise<ClosableSink> {
  const { default: SqlDatabase } = await import('@tauri-apps/plugin-sql');
  const { homeDir, join } = await import('@tauri-apps/api/path');
  const db: Database = await SqlDatabase.load(
    `sqlite:${await join(await homeDir(), namespace, 'loot.db')}`,
  );
  await db.execute('PRAGMA journal_mode=WAL');   // concurrent reads for the loot view
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

  return {
    write: (rows) => { queue.push(...rows); void drain(); },
    close: async () => { await db.close(); },
  };
}

// Subscribe the recorder to `onEnvelope`; the sink DB is picked from the first
// Snapshot's data namespace (attachRecorder), and published to the loot view.
export function startTauriLootRecorder(
  onEnvelope: (fn: (env: Envelope) => void) => () => void,
): () => void {
  return attachRecorder(onEnvelope, makeTauriSink, setLootNamespace);
}
