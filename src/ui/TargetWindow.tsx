import { useEffect, useState } from 'react';
import { FloatingWindow } from './FloatingWindow';
import { ItemIcon } from './ItemIcon';
import type { SpawnStore } from '../state/store';
import { classDisplay } from './classes';
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
//
// Renders nothing when there is no current target — spawnId null, or the
// spawn gone from the store (spawnRemoved/spawnKilled both delete it, so a
// despawned/dead target hides the window automatically). Overall visibility
// is owned by the View-menu "Target Window" toggle in App; there is
// deliberately no close button.
export function TargetWindow({
  store,
  tick,
  spawnId,
}: {
  store: SpawnStore;
  tick: number;
  spawnId: number | null;
}) {
  void tick;
  // Local 1Hz clock so buff timers count down between server updates.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const spawn = spawnId == null ? undefined : store.byId(spawnId);
  if (!spawn) return null;

  // Prefer PlayerStats.level so con doesn't drift after a ding (same
  // reasoning as SpawnList).
  const pLevel = store.stats()?.level ?? store.player()?.level ?? 0;
  const conCol = conHex(conOf(pLevel, spawn.level));
  // EQL mobs can be multiclass — show e.g. "SHD/DRU/MNK"; single-class mobs
  // fall back to the abbreviation ("WAR"). 0/no class renders blank.
  const classLabel = classDisplay(spawn.classMask, spawn.class, { short: true });
  // Targeting yourself is reachable (the pinned SpawnList row and the map dot
  // are both selectable), and the self spawn record has no usable HP — the
  // daemon routes player vitals through player_stats. Read stats() for self.
  const isSelf = spawn.id === store.player()?.id;
  const selfStats = isSelf ? store.stats() : undefined;
  const hpCur = isSelf ? (selfStats?.hpCur ?? 0) : spawn.hpCur;
  const hpMax = isSelf ? (selfStats?.hpMax ?? 0) : spawn.hpMax;
  const hpPct = hpMax > 0 ? Math.max(0, Math.min(100, (hpCur / hpMax) * 100)) : 0;

  const effects = store.effectsFor(spawn.id);
  const snap = store.spawnEffectsState();
  const capturedMs = snap ? Number(snap.capturedMs) : now;
  const elapsedSec = Math.max(0, (now - capturedMs) / 1000);

  // Transient cast-in-progress line for the current target. castFor prunes
  // itself once the cast time elapses, so this drops out on its own.
  const cast = store.castFor(spawn.id, now);
  const castRemaining =
    cast && Math.max(0, (cast.startedAt + cast.castTimeMs - now) / 1000);

  return (
    <FloatingWindow id="target" title="Target" defaultSize={{ w: 240, h: 200 }}>
      <div className="flex flex-col gap-1.5 p-2 text-xs">
        <div className="truncate text-sm font-semibold text-foreground">
          {spawn.name || `Spawn ${spawn.id}`}
        </div>
        <div className="font-mono text-[11px]" style={{ color: conCol }}>
          L{spawn.level || '?'}
          {classLabel ? ` ${classLabel}` : ''}
        </div>

        {cast && (
          <div
            className="flex items-baseline gap-1 text-[11px] text-violet-600 dark:text-violet-300"
            title={cast.spellName || `Spell ${cast.spellId}`}
          >
            <span className="shrink-0">⟳ casting:</span>
            <span className="flex-1 truncate">
              {cast.spellName || `Spell ${cast.spellId}`}
            </span>
            <span className="shrink-0 font-mono tabular-nums">
              ({(castRemaining || 0).toFixed(1)}s)
            </span>
          </div>
        )}

        <div>
          <div className="flex items-baseline justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
            <span>HP</span>
            <span className="font-mono normal-case tracking-normal text-foreground">
              {hpMax > 0 ? `${Math.round(hpPct)}%` : '—'}
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
    </FloatingWindow>
  );
}
