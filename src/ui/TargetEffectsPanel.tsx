import { useEffect, useState } from 'react';
import type { SpawnStore } from '../state/store';

function formatRemaining(secs: number): string {
  if (!Number.isFinite(secs) || secs <= 0) return '—';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Effects (DoTs / debuffs / snares) the player has cast on the currently
// selected/targeted mob, counting down. Mirrors BuffsPanel but reads
// store.effectsFor(spawnId) instead of the personal buff list. Follows the
// App-level `selectedId` passed as `spawnId`.
export function TargetEffectsPanel({
  store,
  tick,
  spawnId,
}: {
  store: SpawnStore;
  tick: number;
  spawnId: number | null;
}) {
  void tick;
  // Local 1Hz clock so timers count down between server SpawnEffectsUpdate
  // messages.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (spawnId == null) {
    return (
      <div className="px-2 py-2 text-xs text-muted-foreground">
        No target selected.
      </div>
    );
  }

  const effects = store.effectsFor(spawnId);
  const target = store.byId(spawnId);
  if (effects.length === 0) {
    return (
      <div className="px-2 py-2 text-xs text-muted-foreground">
        No active effects on {target?.name || `spawn ${spawnId}`}.
      </div>
    );
  }

  const snap = store.spawnEffectsState();
  const capturedMs = snap ? Number(snap.capturedMs) : now;
  const elapsedSec = Math.max(0, (now - capturedMs) / 1000);

  // Permanent effects (duration_s <= 0) sort to the top; stable sort keeps
  // each group in server order.
  const ordered = [...effects].sort(
    (a, b) => Number(b.durationS <= 0) - Number(a.durationS <= 0),
  );

  return (
    <div className="flex flex-col py-1 text-xs">
      <div className="truncate px-2 pb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
        {target?.name || `Spawn ${spawnId}`}
      </div>
      {ordered.map((b, i) => {
        const remaining = b.durationS - elapsedSec;
        const permanent = b.durationS <= 0;
        // Effects on mobs are overwhelmingly detrimental; mark them red like
        // the debuff rows in the personal Buffs panel.
        const debuff = !b.beneficial;
        // Amber "expiring soon" doubles as a recast cue — your snare/DoT is
        // about to fall off the mob.
        const expiringSoon = !permanent && remaining > 0 && remaining < 30;
        return (
          <div
            key={`${b.spellId}-${i}`}
            className={
              'flex items-baseline gap-2 border-b border-border px-2 py-0.5 last:border-b-0 ' +
              (debuff ? 'border-l-2 border-l-red-500 bg-red-500/10' : '')
            }
          >
            <span
              className={
                'flex-1 truncate ' +
                (debuff ? 'text-red-600 dark:text-red-300' : 'text-foreground')
              }
              title={b.spellName || `Spell ${b.spellId}`}
            >
              {b.spellName || `(spell ${b.spellId})`}
            </span>
            <span
              className={
                'shrink-0 font-mono text-[10px] tabular-nums ' +
                (permanent
                  ? 'text-muted-foreground'
                  : expiringSoon
                  ? 'text-amber-600 dark:text-amber-300'
                  : remaining <= 0
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-emerald-600 dark:text-emerald-300')
              }
            >
              {permanent ? '∞' : formatRemaining(remaining)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
