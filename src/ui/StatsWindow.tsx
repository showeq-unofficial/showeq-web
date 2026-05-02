import { useRef, useState } from 'react';
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable';
import { localPrefs } from '../state/localPrefs';
import type { SpawnStore } from '../state/store';

function StatCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between rounded bg-bg-base px-1.5 py-1 text-xs">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="font-mono text-foreground">{value || '—'}</span>
    </div>
  );
}

export function StatsWindow({
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
  const [pos] = useState(() => localPrefs.windowPos('stats'));
  const handleStop = (_e: DraggableEvent, data: DraggableData) => {
    localPrefs.setWindowPos('stats', { x: data.x, y: data.y });
  };
  const s = store.stats();

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".stats-drag-handle"
      defaultPosition={pos}
      onStop={handleStop}
    >
      <div
        ref={nodeRef}
        className="fixed left-1/2 top-1/2 z-50 flex w-56 -translate-x-1/2 -translate-y-1/2 flex-col rounded border border-border bg-bg-panel shadow-xl"
      >
        <div className="stats-drag-handle flex cursor-move items-center justify-between border-b border-border bg-bg-alt px-2 py-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Stats
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-bg-base hover:text-foreground"
            aria-label="Close stats window"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1 p-2">
          <StatCell label="STR" value={s?.str ?? 0} />
          <StatCell label="STA" value={s?.sta ?? 0} />
          <StatCell label="AGI" value={s?.agi ?? 0} />
          <StatCell label="DEX" value={s?.dex ?? 0} />
          <StatCell label="WIS" value={s?.wis ?? 0} />
          <StatCell label="INT" value={s?.int ?? 0} />
          <StatCell label="CHA" value={s?.cha ?? 0} />
        </div>
      </div>
    </Draggable>
  );
}
