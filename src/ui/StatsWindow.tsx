import { FloatingWindow } from './FloatingWindow';
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
  const s = store.stats();

  return (
    <FloatingWindow
      id="stats"
      title="Stats"
      defaultSize={{ w: 240, h: 220 }}
      onClose={onClose}
    >
      <div className="grid grid-cols-2 gap-1 p-2">
        <StatCell label="STR" value={s?.str ?? 0} />
        <StatCell label="STA" value={s?.sta ?? 0} />
        <StatCell label="AGI" value={s?.agi ?? 0} />
        <StatCell label="DEX" value={s?.dex ?? 0} />
        <StatCell label="WIS" value={s?.wis ?? 0} />
        <StatCell label="INT" value={s?.int ?? 0} />
        <StatCell label="CHA" value={s?.cha ?? 0} />
      </div>
    </FloatingWindow>
  );
}
