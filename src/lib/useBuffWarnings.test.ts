import { describe, expect, it } from 'vitest';
import { stepBuffWarning, type BuffWarnMemo } from './useBuffWarnings';

const T = 30; // threshold seconds

// Drive a sequence of remaining-second observations through the state
// machine, returning how many times it fired.
function run(seq: number[], threshold = T): number {
  let memo: BuffWarnMemo | undefined;
  let fires = 0;
  for (const remaining of seq) {
    const r = stepBuffWarning(memo, remaining, threshold);
    if (r.fire) fires++;
    memo = r.memo;
  }
  return fires;
}

describe('stepBuffWarning', () => {
  it('fires once when a long buff crosses the threshold downward', () => {
    // seen well above, ticks down, crosses 30 → exactly one fire.
    expect(run([200, 120, 60, 31, 29, 20, 10])).toBe(1);
  });

  it('does NOT fire on a short buff first seen below the threshold (Blooming Heal ~24s)', () => {
    // A HoT whose whole life is under the 30s window must stay silent —
    // this is the "fires on cast" bug.
    expect(run([24, 23, 20, 10, 3])).toBe(0);
  });

  it('does NOT fire on a mid-session reconnect where the buff is first seen below threshold', () => {
    // Connect with a real buff already at 18s remaining: never witnessed
    // the crossing, so no alert.
    expect(run([18, 12, 5])).toBe(0);
  });

  it('re-arms after a recast (upward jump) and fires again on the next fade', () => {
    // cross → fire, recast back up, cross again → fire. Two total.
    expect(run([200, 29, 15, 220, 100, 29, 10])).toBe(2);
  });

  it('fires only once per crossing (no repeat while staying below)', () => {
    expect(run([200, 40, 29, 28, 27, 26, 25])).toBe(1);
  });

  it('treats a buff sitting exactly at the threshold as not-yet-crossed', () => {
    // remaining === threshold is not "below", so no fire until it dips under.
    expect(run([30, 30, 30])).toBe(0);
    expect(run([31, 30, 29])).toBe(1);
  });

  it('a small (<=5s) upward wobble is not treated as a recast', () => {
    // Server jitter of a few seconds after firing must not re-arm.
    expect(run([200, 29, 27, 30, 25, 20])).toBe(1);
  });
});
