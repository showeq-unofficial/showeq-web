import { useMemo, useRef, useState } from 'react';
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable';
import { localPrefs } from '../state/localPrefs';
import type { SpawnStore } from '../state/store';

// Indices into Item.stats[] / ItemCacheTotals.stats[]; mirrors
// ItemStatIndex in showeq-daemon/src/itempacket.h.
const STAT_LABELS = ['STR', 'STA', 'AGI', 'DEX', 'CHA', 'INT', 'WIS'] as const;
// Indices into Item.resists[] / ItemCacheTotals.resists[]; mirrors
// ItemResistIndex.
const RESIST_LABELS = ['CR', 'DR', 'PR', 'MR', 'FR'] as const;

function Cell({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-baseline justify-between rounded bg-bg-base px-1.5 py-1 text-xs">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-foreground">{value || '—'}</span>
    </div>
  );
}

export function InventoryStatsPanel({
  store,
  tick,
  onClose,
}: {
  store: SpawnStore;
  tick: number;
  onClose: () => void;
}) {
  void tick;
  const nodeRef = useRef<HTMLDivElement>(null);
  const [pos] = useState(() => localPrefs.windowPos('inventoryStats'));
  const handleStop = (_e: DraggableEvent, data: DraggableData) => {
    localPrefs.setWindowPos('inventoryStats', { x: data.x, y: data.y });
  };

  const t = store.totals();
  const items = store.allItems();

  // The per-item list: only items that contribute to HP, mana, AC, or
  // any stat/resist worth showing. Filters out consumables/quest items
  // with all-zero gear stats so the panel stays focused on gear.
  const gearItems = useMemo(() => {
    return items
      .filter((it) => {
        if (it.hp || it.mana || it.endurance || it.ac) return true;
        if (it.stats.some((v) => v !== 0)) return true;
        if (it.resists.some((v) => v !== 0)) return true;
        if (it.corruption) return true;
        return false;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".inv-drag-handle"
      defaultPosition={pos}
      onStop={handleStop}
    >
      <div
        ref={nodeRef}
        className="fixed left-1/2 top-1/2 z-50 flex w-80 -translate-x-1/2 -translate-y-1/2 flex-col rounded border border-border bg-bg-panel shadow-xl"
      >
        <div className="inv-drag-handle flex cursor-move items-center justify-between border-b border-border bg-bg-alt px-2 py-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Inventory totals
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-bg-base hover:text-foreground"
            aria-label="Close inventory stats panel"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-2 p-2">
          <div className="text-[10px] text-muted-foreground">
            Sums over every item the daemon has observed via OP_ItemPacket
            this session and prior runs. v1 scope: counts everything in the
            cache (worn + inventory + bags + bank) — worn-only requires
            decoding OP_PlayerProfile worn-slot offsets.
          </div>

          <div className="grid grid-cols-2 gap-1">
            <Cell label="Items" value={t?.itemCount ?? 0} />
            <Cell label="HP" value={t?.hp ?? 0} />
            <Cell label="Mana" value={t?.mana ?? 0} />
            <Cell label="End" value={t?.endurance ?? 0} />
            <Cell label="AC" value={t?.ac ?? 0} />
            {t?.corruption ? <Cell label="Corr" value={t.corruption} /> : null}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {STAT_LABELS.map((lbl, i) => (
              <Cell key={lbl} label={lbl} value={t?.stats[i] ?? 0} />
            ))}
          </div>

          <div className="grid grid-cols-5 gap-1">
            {RESIST_LABELS.map((lbl, i) => (
              <Cell key={lbl} label={lbl} value={t?.resists[i] ?? 0} />
            ))}
          </div>

          {gearItems.length > 0 && (
            <details className="rounded border border-border bg-bg-base/50">
              <summary className="cursor-pointer px-1.5 py-1 text-xs text-muted-foreground hover:text-foreground">
                Gear items ({gearItems.length})
              </summary>
              <ul className="max-h-64 overflow-y-auto px-2 py-1 text-xs">
                {gearItems.map((it) => (
                  <li
                    key={it.id}
                    className="flex items-baseline justify-between gap-2 border-b border-border/30 py-0.5 last:border-b-0"
                  >
                    <span className="truncate text-foreground" title={it.name}>
                      {it.name}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                      {it.hp ? `${it.hp}hp ` : ''}
                      {it.mana ? `${it.mana}m ` : ''}
                      {it.ac ? `${it.ac}ac` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </Draggable>
  );
}
