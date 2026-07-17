import { useEffect, useState } from 'react';
import { FloatingWindow } from './FloatingWindow';
import { ItemIcon } from './ItemIcon';
import type { SpawnStore } from '../state/store';
import { classShortOf } from './classes';
import { conHex, conOf } from './concolor';

function formatRemaining(secs: number): string {
  if (!Number.isFinite(secs) || secs <= 0) return '—';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// EQ-style target HUD for the App-level selectedId: con-colored name/level/
// class, an HP bar, and the mob's active buff icons. Mana is omitted — mobs
// don't report it on the wire.
export function TargetWindow({
  store,
  tick,
  spawnId,
  onClose,
}: {
  store: SpawnStore;
  tick: number;
  spawnId: number | null;
  onClose: () => void;
}) {
  void tick;
  // Local 1Hz clock so buff timers count down between server updates.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const spawn = spawnId == null ? undefined : store.byId(spawnId);

  return (
    <FloatingWindow id="target" title="Target" defaultSize={{ w: 240, h: 200 }} onClose={onClose}>
      {!spawn ? (
        <div className="px-2 py-2 text-xs text-muted-foreground">No target.</div>
      ) : (
        (() => {
          // Prefer PlayerStats.level so con doesn't drift after a ding (same
          // reasoning as SpawnList).
          const pLevel = store.stats()?.level ?? store.player()?.level ?? 0;
          const conCol = conHex(conOf(pLevel, spawn.level));
          const short = classShortOf(spawn.class);
          const hpPct = spawn.hpMax > 0 ? Math.max(0, Math.min(100, (spawn.hpCur / spawn.hpMax) * 100)) : 0;

          const effects = store.effectsFor(spawn.id);
          const snap = store.spawnEffectsState();
          const capturedMs = snap ? Number(snap.capturedMs) : now;
          const elapsedSec = Math.max(0, (now - capturedMs) / 1000);

          return (
            <div className="flex flex-col gap-1.5 p-2 text-xs">
              <div className="truncate text-sm font-semibold text-foreground">
                {spawn.name || `Spawn ${spawn.id}`}
              </div>
              <div className="font-mono text-[11px]" style={{ color: conCol }}>
                L{spawn.level || '?'}
                {spawn.class ? ` ${short}` : ''}
              </div>

              <div>
                <div className="flex items-baseline justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
                  <span>HP</span>
                  <span className="font-mono normal-case tracking-normal text-foreground">
                    {spawn.hpMax > 0 ? `${Math.round(hpPct)}%` : '—'}
                  </span>
                </div>
                <div className="mt-0.5 h-2 overflow-hidden rounded bg-bg-base">
                  <div
                    className="h-full bg-red-600 transition-[width] duration-200 ease-out"
                    style={{ width: `${hpPct}%` }}
                  />
                </div>
              </div>

              {effects.length === 0 ? (
                <div className="text-[11px] text-muted-foreground">No buffs.</div>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {effects.map((b, i) => {
                    const permanent = b.durationS <= 0;
                    const remaining = b.durationS - elapsedSec;
                    const label = permanent ? '∞' : formatRemaining(remaining);
                    const name = b.spellName || `Spell ${b.spellId}`;
                    return (
                      <span key={`${b.spellId}-${i}`} title={`${name} — ${label}`}>
                        <ItemIcon icon={b.icon} atlas="spells" base={0} size={22} />
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()
      )}
    </FloatingWindow>
  );
}
