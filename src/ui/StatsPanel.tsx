import type { SpawnStore } from '../state/store';
import { classNameOf } from './classes';

function pct(cur: number, max: number): number {
  if (!max || max <= 0) return 0;
  return Math.max(0, Math.min(100, (cur / max) * 100));
}

function fmt(n: number): string {
  return n.toLocaleString();
}

// Single horizontal bar with current/max readout.
function Bar({
  label,
  cur,
  max,
  color,
  numericRight,
}: {
  label: string;
  cur: number;
  max: number;
  color: string;
  numericRight?: string;
}) {
  const p = pct(cur, max);
  const right = numericRight ?? (max > 0 ? `${fmt(cur)} / ${fmt(max)}` : '—');
  return (
    <div className="px-2 py-1">
      <div className="flex items-baseline justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono normal-case tracking-normal text-foreground">
          {right}
        </span>
      </div>
      <div className="mt-0.5 h-2 overflow-hidden rounded bg-bg-base">
        <div
          className={`h-full transition-[width] duration-200 ease-out ${color}`}
          style={{ width: `${p}%` }}
        />
      </div>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between rounded bg-bg-base px-1.5 py-1 text-xs">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="font-mono text-foreground">{value || '—'}</span>
    </div>
  );
}

export function StatsPanel({ store, tick }: { store: SpawnStore; tick: number }) {
  // tick is just a dependency so the panel re-reads after each store apply.
  void tick;
  const s = store.stats();

  if (!s) {
    return (
      <div className="px-2 py-2 text-xs text-muted-foreground">
        Waiting for player profile…
      </div>
    );
  }

  const className = classNameOf(s.class);
  const headerLabel = s.name
    ? `${s.name}`
    : '(unknown)';
  const subLabel = s.level
    ? `Level ${s.level}${className ? ' ' + className : ''}`
    : className;

  return (
    <div className="flex flex-col gap-1 py-1">
      <div className="px-2 pb-1 pt-0.5">
        <div className="text-sm font-semibold text-foreground">{headerLabel}</div>
        {subLabel && <div className="text-[11px] text-muted-foreground">{subLabel}</div>}
      </div>

      <Bar label="HP"   cur={s.hpCur}      max={s.hpMax}      color="bg-red-600" />
      <Bar label="Mana" cur={s.manaCur}    max={s.manaMax}    color="bg-blue-600" />
      <Bar label="Stam" cur={s.staminaCur} max={s.staminaMax} color="bg-emerald-600" />

      <div className="mx-2 my-1 border-t border-border" />

      <Bar
        label="Exp"
        cur={s.expCur}
        max={s.expMax}
        color="bg-amber-500"
        numericRight={s.expMax > 0 ? `${pct(s.expCur, s.expMax).toFixed(1)}%` : '—'}
      />
      <Bar
        label={`AA · ${fmt(s.aaPoints)} pt${s.aaPoints === 1 ? '' : 's'}`}
        cur={s.aaExpCur}
        max={s.aaExpMax}
        color="bg-purple-500"
        numericRight={s.aaExpMax > 0 ? `${pct(s.aaExpCur, s.aaExpMax).toFixed(1)}%` : '—'}
      />

      <div className="mx-2 my-1 border-t border-border" />

      <div className="grid grid-cols-2 gap-1 px-2 pb-2">
        <StatCell label="STR" value={s.str} />
        <StatCell label="STA" value={s.sta} />
        <StatCell label="AGI" value={s.agi} />
        <StatCell label="DEX" value={s.dex} />
        <StatCell label="WIS" value={s.wis} />
        <StatCell label="INT" value={s.int} />
        <StatCell label="CHA" value={s.cha} />
      </div>
    </div>
  );
}
