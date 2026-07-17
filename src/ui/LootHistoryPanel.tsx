import type { SpawnStore } from '../state/store';
import { ItemIcon } from './ItemIcon';

// Corpse loot drops (eql OP_LootDrops), most-recent-first. Each entry is a
// corpse and the items it dropped. Reads the mutate-in-place store buffer;
// `tick` drives the re-render, not the array reference (see CLAUDE.md).
export function LootHistoryPanel({ store, tick }: { store: SpawnStore; tick: number }) {
  void tick;
  const entries = store.lootDropEntries();

  if (entries.length === 0) {
    return (
      <div className="px-2 py-2 text-xs text-muted-foreground">
        Waiting for loot…
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto px-2 py-1 text-[11px]">
      {Array.from({ length: entries.length }, (_, i) => entries[entries.length - 1 - i]).map((e) => (
        <div key={e.seq.toString()} className="border-t border-border/30 py-1 first:border-t-0">
          <div className="font-semibold text-foreground">{e.corpseName || '(corpse)'}</div>
          {e.items.length === 0 ? (
            <div className="pl-6 text-muted-foreground italic">(no items)</div>
          ) : (
            e.items.map((it, j) => (
              <div key={j} className="flex items-center gap-1.5 pl-1">
                <ItemIcon icon={it.icon} size={24} />
                <span className="text-foreground">{it.name}</span>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
