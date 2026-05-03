import { useRef, useState } from 'react';
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable';
import { localPrefs } from '../state/localPrefs';
import type { MoneyTotals, SpawnStore } from '../state/store';

function formatTime(ts: number): string {
  return new Date(ts).toTimeString().slice(0, 8);
}

function formatCount(n: number): string {
  return n.toLocaleString();
}

// Compact coin readout. Suppresses zero denominations entirely so a
// pure-platinum drop reads as "12p" instead of "12p 0g 0s 0c". Falls
// back to "0c" only when nothing has been looted at all.
function formatMoney(m: MoneyTotals): string {
  const parts: string[] = [];
  if (m.platinum) parts.push(`${formatCount(m.platinum)}p`);
  if (m.gold)     parts.push(`${formatCount(m.gold)}g`);
  if (m.silver)   parts.push(`${formatCount(m.silver)}s`);
  if (m.copper)   parts.push(`${formatCount(m.copper)}c`);
  return parts.length > 0 ? parts.join(' ') : '0c';
}

type Aggregate = {
  itemName: string;
  count: number;
  yourCount: number;
  lastTs: number;
};

export function LootWindow({
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
  const [pos] = useState(() => localPrefs.windowPos('loot'));
  const handleStop = (_e: DraggableEvent, data: DraggableData) => {
    localPrefs.setWindowPos('loot', { x: data.x, y: data.y });
  };
  // Re-aggregating on every render is cheap (<= LOOT_LOG_LIMIT entries)
  // and avoids needing a separate cache invalidation when the user hits
  // Clear.
  const entries = store.lootEntries();
  const money = store.moneyTotal();
  const aggregates = new Map<string, Aggregate>();
  for (const e of entries) {
    const a = aggregates.get(e.itemName);
    const isYou = e.looter === '';
    if (a) {
      a.count += 1;
      if (isYou) a.yourCount += 1;
      if (e.localTs > a.lastTs) a.lastTs = e.localTs;
    } else {
      aggregates.set(e.itemName, {
        itemName: e.itemName,
        count: 1,
        yourCount: isYou ? 1 : 0,
        lastTs: e.localTs,
      });
    }
  }
  // Newest activity first; ties broken by name for stable display.
  const rows = Array.from(aggregates.values()).sort((a, b) => {
    if (b.lastTs !== a.lastTs) return b.lastTs - a.lastTs;
    return a.itemName.localeCompare(b.itemName);
  });
  const recent = entries.slice(-5).reverse();

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".loot-drag-handle"
      defaultPosition={pos}
      onStop={handleStop}
    >
      <div
        ref={nodeRef}
        className="fixed left-1/2 top-1/2 z-50 flex w-80 -translate-x-1/2 -translate-y-1/2 flex-col rounded border border-border bg-bg-panel shadow-xl"
      >
        <div className="loot-drag-handle flex cursor-move items-center justify-between border-b border-border bg-bg-alt px-2 py-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Loot · {entries.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => store.clearLootLog()}
              className="rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground hover:bg-bg-base hover:text-foreground"
              title="Clear session loot"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-bg-base hover:text-foreground"
              aria-label="Close loot window"
            >
              ×
            </button>
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto px-2 py-1">
          {rows.length === 0 ? (
            <div className="py-2 text-center text-xs text-muted-foreground">
              No loot yet this session
            </div>
          ) : (
            <table className="w-full text-xs">
              <tbody>
                {rows.map((r) => (
                  <tr key={r.itemName} className="border-b border-border/40 last:border-0">
                    <td className="py-0.5 text-foreground">
                      {r.itemName}
                      {r.yourCount === 0 && (
                        <span className="ml-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                          group
                        </span>
                      )}
                    </td>
                    <td className="py-0.5 text-right font-mono text-amber-500">
                      ×{r.count}
                      {r.yourCount > 0 && r.yourCount < r.count && (
                        <span className="ml-1 text-[10px] text-muted-foreground">
                          ({r.yourCount} you)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="border-t border-border bg-bg-base/50 px-2 py-1">
          <div className="mb-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            Recent ({recent.length})
          </div>
          <div className="max-h-24 overflow-y-auto font-mono text-[11px]">
            {recent.length === 0 ? (
              <div className="text-muted-foreground">—</div>
            ) : (
              recent.map((e, i) => (
                <div key={i} className="flex justify-between gap-2 leading-tight">
                  <span className="text-muted-foreground">{formatTime(e.localTs)}</span>
                  <span className="flex-1 truncate text-foreground">
                    <span className="text-muted-foreground">
                      {e.looter === '' ? 'you' : e.looter}
                    </span>
                    {' · '}
                    {e.itemName}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-2 border-t border-border bg-bg-alt px-2 py-1">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Money
          </span>
          <span className="font-mono text-xs text-amber-400">
            {formatMoney(money)}
          </span>
        </div>
      </div>
    </Draggable>
  );
}
