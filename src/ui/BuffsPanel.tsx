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

export function BuffsPanel({ store, tick }: { store: SpawnStore; tick: number }) {
  void tick;
  // Local clock-driven re-render so timers count down between server
  // BuffsUpdate messages. 1Hz is plenty for second-precision display.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const buffs = store.buffsState();
  const visibleBuffs = buffs?.buffs.filter((b) => !b.isSong) ?? [];
  if (!buffs || visibleBuffs.length === 0) {
    return (
      <div className="px-2 py-2 text-xs text-muted-foreground">
        No active buffs.
      </div>
    );
  }

  // captured_ms is the daemon clock when the snapshot was taken. We
  // assume client and server clocks roughly agree; small skew just
  // shifts every timer by a constant offset.
  const capturedMs = Number(buffs.capturedMs);
  const elapsedSec = Math.max(0, (now - capturedMs) / 1000);

  return (
    <div className="flex flex-col py-1 text-xs">
      {visibleBuffs.map((b, i) => {
        const remaining = b.durationS - elapsedSec;
        // Permanent buffs come over with duration_s <= 0 in some cases;
        // distinguish from "expired but still in list" by looking at
        // the snapshot value directly.
        const permanent = b.durationS <= 0;
        const expiringSoon = !permanent && remaining > 0 && remaining < 30;
        return (
          <div
            key={`${b.spellId}-${i}`}
            className="flex items-baseline gap-2 border-b border-border px-2 py-0.5 last:border-b-0"
          >
            <span className="flex-1 truncate text-foreground" title={b.spellName || `Spell ${b.spellId}`}>
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
