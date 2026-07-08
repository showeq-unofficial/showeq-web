import { describe, expect, it } from 'vitest';
import { formatLoc, runtimeX, runtimeY } from './coords';

describe('coords', () => {
  // Ground truth captured live on EverQuest Legends: in-game /loc read
  // "2429.42, 1006.37, 17.57" (EQ prints Y, X, Z) while the daemon shipped
  // the screen-convention wire pos (-1006, -2429, 17). The readout must
  // flip back to /loc order + sign.
  it('formats a wire pos as the in-game /loc string (Y, X, Z)', () => {
    expect(formatLoc(-1006, -2429, 17)).toBe('2429, 1006, 17');
  });

  it('rounds fractional wire coords', () => {
    expect(formatLoc(-1006.4, -2429.6, 17.5)).toBe('2430, 1006, 18');
  });

  it('handles negative runtime coords (west/south of origin)', () => {
    // wire (743, -4359, 6) -> runtime X = -743, runtime Y = 4359.
    expect(formatLoc(743, -4359, 6)).toBe('4359, -743, 6');
  });

  it('runtimeX / runtimeY negate a single screen-convention axis', () => {
    expect(runtimeX(-1006)).toBe(1006);
    expect(runtimeY(-2429)).toBe(2429);
    expect(runtimeX(500)).toBe(-500);
  });
});
