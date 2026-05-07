import { useEffect, useRef } from 'react';
import type { SpawnStore } from '@/state/store';
import { useAlertsStore } from '@/state/alertsStore';
import { playBuffFading } from '@/lib/audioCue';

// App-level hook that watches `store.buffsState()` and fires the
// buff-fading cue once per buff as its remaining duration crosses the
// configured warning threshold downward. Lives in App so the cue fires
// regardless of whether the Buffs panel is mounted or visible — the
// daemon emits BuffsUpdate independent of UI state.
//
// Recast detection: when a player re-applies the same buff, durationS
// jumps back up. We treat any meaningful upward jump (5s of slack) as a
// recast and clear the warned flag so the next fade fires a fresh cue.
// Buffs that drop out of the snapshot are pruned so the next acquisition
// is a clean slate.
export function useBuffWarnings(store: SpawnStore): void {
  // {spellId -> {lastRemaining, warned}}. Memory bounded by the player's
  // active buff cap (low double digits at most).
  const warnedRef = useRef<Map<number, { lastRemaining: number; warned: boolean }>>(new Map());

  useEffect(() => {
    const tick = () => {
      const buffs = store.buffsState();
      if (!buffs) return;
      const threshold = useAlertsStore.getState().buffWarningSecs;
      const cap = Number(buffs.capturedMs);
      const elapsed = Math.max(0, (Date.now() - cap) / 1000);
      const seen = new Set<number>();
      for (const b of buffs.buffs) {
        if (b.durationS <= 0) continue;
        seen.add(b.spellId);
        const remaining = b.durationS - elapsed;
        const prev = warnedRef.current.get(b.spellId);
        if (prev && remaining > prev.lastRemaining + 5) {
          warnedRef.current.set(b.spellId, { lastRemaining: remaining, warned: false });
          continue;
        }
        const wasAbove = !prev || prev.lastRemaining > threshold;
        const isBelow = remaining <= threshold && remaining > 0;
        if (wasAbove && isBelow && !prev?.warned) {
          playBuffFading();
          warnedRef.current.set(b.spellId, { lastRemaining: remaining, warned: true });
        } else {
          warnedRef.current.set(b.spellId, {
            lastRemaining: remaining,
            warned: prev?.warned ?? false,
          });
        }
      }
      for (const id of warnedRef.current.keys()) {
        if (!seen.has(id)) warnedRef.current.delete(id);
      }
    };
    // 1 Hz is plenty: the threshold (default 30s) absorbs sub-second
    // accuracy. Faster polling just burns CPU on a worker that does
    // nothing 99% of the time.
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [store]);
}
