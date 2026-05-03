import type { SpawnStore } from '../state/store';
import { classHasMana, classNameOf } from './classes';

function pct(cur: number, max: number): number {
  if (!max || max <= 0) return 0;
  return Math.max(0, Math.min(100, (cur / max) * 100));
}

function fmt(n: number): string {
  return n.toLocaleString();
}

// Single horizontal bar with current/max readout. Optional `centerInfo`
// renders between the label and the right-side numeric (used for the XP
// rate so it sits inline with "Exp" and "10.1%").
function Bar({
  label,
  cur,
  max,
  color,
  numericRight,
  centerInfo,
}: {
  label: string;
  cur: number;
  max: number;
  color: string;
  numericRight?: string;
  centerInfo?: string;
}) {
  const p = pct(cur, max);
  const right = numericRight ?? (max > 0 ? `${fmt(cur)} / ${fmt(max)}` : '—');
  return (
    <div className="px-2 py-1">
      <div className="flex items-baseline gap-2 text-[10px] uppercase tracking-wide text-muted-foreground">
        <span>{label}</span>
        {centerInfo && (
          <span className="flex-1 truncate text-center font-mono normal-case tracking-normal">
            {centerInfo}
          </span>
        )}
        <span className={`font-mono normal-case tracking-normal text-foreground${centerInfo ? '' : ' ml-auto'}`}>
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

// AA bar label. Live carries spent + unspent independently; Quarm only
// has unspent (spent stays 0). Show whichever side is nonzero, falling
// back to a bare "AA" before the profile arrives.
function aaLabel(spent: number, unspent: number): string {
  const parts: string[] = [];
  if (spent > 0) parts.push(`${fmt(spent)} spent`);
  if (unspent > 0) parts.push(`${fmt(unspent)} ready`);
  return parts.length === 0 ? 'AA' : `AA · ${parts.join(' · ')}`;
}

// "1h 23m" / "12m 34s" / ">99h" / "—". Matches the granularity people
// actually care about when watching an XP bar tick.
function fmtDuration(ms: number): string {
  if (!isFinite(ms) || ms <= 0) return '—';
  const totalSec = Math.round(ms / 1000);
  if (totalSec >= 100 * 3600) return '>99h';
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function PanelButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded border border-border bg-bg-base px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground hover:border-blue-500/60 hover:bg-blue-600/20 hover:text-blue-100"
    >
      {label}
    </button>
  );
}

export function PlayerPanel({
  store,
  tick,
  onOpenSkills,
  onOpenStats,
  onOpenLoot,
  onOpenItems,
  onOpenAA,
}: {
  store: SpawnStore;
  tick: number;
  onOpenSkills?: () => void;
  onOpenStats?: () => void;
  onOpenLoot?: () => void;
  onOpenItems?: () => void;
  onOpenAA?: () => void;
}) {
  // tick is just a dependency so the panel re-reads after each store apply.
  void tick;
  const s = store.stats();
  const rate = store.expRate();

  if (!s) {
    return (
      <div className="px-2 py-2 text-xs text-muted-foreground">
        Waiting for player profile…
      </div>
    );
  }

  const className = classNameOf(s.class);
  const headerLabel = s.name ? `${s.name}` : '(unknown)';
  const subLabel = s.level
    ? `Level ${s.level}${className ? ' ' + className : ''}`
    : className;

  return (
    <div className="flex flex-col gap-1 py-1">
      <div className="flex items-start justify-between gap-2 px-2 pb-1 pt-0.5">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-foreground">{headerLabel}</div>
          {subLabel && <div className="text-[11px] text-muted-foreground">{subLabel}</div>}
        </div>
        <div className="flex shrink-0 gap-1">
          {onOpenStats && <PanelButton label="Stats" onClick={onOpenStats} />}
          {onOpenSkills && <PanelButton label="Skills" onClick={onOpenSkills} />}
          {onOpenAA && <PanelButton label="AA" onClick={onOpenAA} />}
          {onOpenLoot && <PanelButton label="Loot" onClick={onOpenLoot} />}
          {onOpenItems && <PanelButton label="Items" onClick={onOpenItems} />}
        </div>
      </div>

      <Bar label="HP"   cur={s.hpCur}      max={s.hpMax}      color="bg-red-600" />
      {classHasMana(s.class) && (
        <Bar label="Mana" cur={s.manaCur} max={s.manaMax} color="bg-blue-600" />
      )}
      <Bar label="End"  cur={s.enduranceCur} max={s.enduranceMax} color="bg-yellow-500" />

      <div className="mx-2 my-1 border-t border-border" />

      <Bar
        label="Exp"
        cur={s.expCur}
        max={s.expMax}
        color="bg-amber-500"
        numericRight={s.expMax > 0 ? `${pct(s.expCur, s.expMax).toFixed(1)}%` : '—'}
        centerInfo={
          rate
            ? `${rate.pctPerHour.toFixed(2)}% / hr · ${rate.msToLevel === null ? '—' : fmtDuration(rate.msToLevel)}`
            : undefined
        }
      />
      <Bar
        label={aaLabel(s.aaPoints, s.aaUnspent)}
        cur={s.aaExpCur}
        max={s.aaExpMax}
        color="bg-purple-500"
        numericRight={s.aaExpMax > 0 ? `${pct(s.aaExpCur, s.aaExpMax).toFixed(1)}%` : '—'}
      />
    </div>
  );
}
