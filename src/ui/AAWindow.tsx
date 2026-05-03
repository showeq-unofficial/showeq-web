import { useRef, useState } from 'react';
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable';
import { localPrefs } from '../state/localPrefs';
import type { SpawnStore } from '../state/store';

// AA-id → human label mapping is OP_SendAATable territory (not in proto today),
// so v1 just shows the numeric ability_id. Sorted by id ascending — no
// stable name-order yet. Once OP_SendAATable record contents are surfaced,
// swap the id for the title_sid lookup.
export function AAWindow({
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
  const [pos] = useState(() => localPrefs.windowPos('aa'));
  const handleStop = (_e: DraggableEvent, data: DraggableData) => {
    localPrefs.setWindowPos('aa', { x: data.x, y: data.y });
  };

  const stats = store.stats();
  const rows = [...(stats?.purchasedAa ?? [])].sort(
    (a, b) => a.abilityId - b.abilityId,
  );
  const totalRanks = rows.reduce((sum, r) => sum + r.rank, 0);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".aa-drag-handle"
      defaultPosition={pos}
      onStop={handleStop}
    >
      <div
        ref={nodeRef}
        className="fixed left-1/2 top-1/2 z-50 flex w-64 -translate-x-1/2 -translate-y-1/2 flex-col rounded border border-border bg-bg-panel shadow-xl"
      >
        <div className="aa-drag-handle flex cursor-move items-center justify-between border-b border-border bg-bg-alt px-2 py-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
            AAs ({rows.length} · {totalRanks} ranks)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-bg-base hover:text-foreground"
            aria-label="Close AA window"
          >
            ×
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto px-2 py-1">
          {rows.length === 0 ? (
            <div className="py-2 text-center text-xs text-muted-foreground">
              No AAs purchased yet
            </div>
          ) : (
            <table className="w-full text-xs">
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.abilityId}
                    className="border-b border-border/40 last:border-0"
                  >
                    <td className="py-0.5 font-mono text-foreground">
                      #{r.abilityId}
                    </td>
                    <td className="py-0.5 text-right font-mono text-amber-500">
                      {r.rank}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Draggable>
  );
}
