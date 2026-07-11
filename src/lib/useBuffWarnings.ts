import { useEffect, useRef } from 'react';
import type { SpawnStore } from '@/state/store';
import { useAlertsStore } from '@/state/alertsStore';
import { playBuffFading } from '@/lib/audioCue';
import { toastBuffFading } from '@/lib/toastCue';
import { speak } from '@/lib/speech';

export type BuffWarnMemo = { lastRemaining: number; warned: boolean };

// Pure per-buff step of the fade-warning state machine. Given the prior
// memo for this spell (or undefined on first sight), the current remaining
// seconds, and the warn threshold, returns the next memo plus whether to
// FIRE the fade cue this tick. Extracted so the crossing logic is unit-
// testable; the hook owns the side effects and the per-spell memo map.
export function stepBuffWarning(
  prev: BuffWarnMemo | undefined,
  remaining: number,
  threshold: number,
): { memo: BuffWarnMemo; fire: boolean } {
  // Recast: a meaningful upward jump (>5s) means the player re-applied the
  // buff, so clear the warned flag to arm a fresh fade.
  if (prev && remaining > prev.lastRemaining + 5) {
    return { memo: { lastRemaining: remaining, warned: false }, fire: false };
  }
  // Only a genuine downward crossing fires: the buff must have been ABOVE
  // the threshold at its previous (or first) observation. A buff first
  // seen already at/below the threshold — a short self-buff like a HoT
  // (Blooming Heal, ~24s), a mob debuff shorter than the window, or a
  // mid-session reconnect — is NOT a crossing we witnessed, so it stays
  // silent. (Using `!prev` here fired such buffs instantly on first sight.)
  const wasAbove = prev ? prev.lastRemaining > threshold : remaining > threshold;
  const isBelow = remaining <= threshold && remaining > 0;
  if (wasAbove && isBelow && !prev?.warned) {
    return { memo: { lastRemaining: remaining, warned: true }, fire: true };
  }
  return { memo: { lastRemaining: remaining, warned: prev?.warned ?? false }, fire: false };
}

// App-level hook that watches `store.buffsState()` and fires the buff-fading
// cue once per buff as its remaining duration crosses the configured warning
// threshold downward. Lives in App so the cue fires regardless of whether the
// Buffs panel is mounted — the daemon emits BuffsUpdate independent of UI
// state. Buffs that drop out of the snapshot are pruned so the next
// acquisition is a clean slate.
export function useBuffWarnings(store: SpawnStore): void {
  // {spellId -> memo}. Memory bounded by the player's active buff cap.
  const warnedRef = useRef<Map<number, BuffWarnMemo>>(new Map());

  useEffect(() => {
    const tick = () => {
      const buffs = store.buffsState();
      if (!buffs) return;
      const threshold = useAlertsStore.getState().buffWarningSecs;
      const cap = Number(buffs.capturedMs);
      const elapsed = Math.max(0, (Date.now() - cap) / 1000);
      const seen = new Set<number>();
      for (const b of buffs.buffs) {
        if (b.isSong) continue;
        if (b.durationS <= 0) continue;
        // Detrimental spells (debuffs / DoTs a mob landed on you) show in
        // the buff bar but must never fire a fade alert. `beneficial` comes
        // from the daemon's spell DB.
        if (!b.beneficial) continue;
        seen.add(b.spellId);
        const remaining = b.durationS - elapsed;
        const { memo, fire } = stepBuffWarning(warnedRef.current.get(b.spellId), remaining, threshold);
        if (fire) {
          // Fire all three output channels off the same crossing — each
          // self-gates on its own toggle, so dedupe/recast are inherited.
          playBuffFading();
          toastBuffFading(b.spellName, remaining, b.spellId);
          speak(`${b.spellName} is fading`);
        }
        warnedRef.current.set(b.spellId, memo);
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
