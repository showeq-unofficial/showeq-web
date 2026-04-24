// EQ con-color rules relative to a player level. The legacy client
// (showeq-c/src/player.cpp) builds a per-level table from the EQ
// compiled tables; for Phase 2 we approximate with the classic
// level-delta bands, which are correct for most level ranges.

export type Con =
  | 'gray'
  | 'green'
  | 'cyan'
  | 'blue'
  | 'white'
  | 'yellow'
  | 'red';

const CON_HEX: Record<Con, string> = {
  gray:   '#808080',
  green:  '#00b050',
  cyan:   '#00e0e0',
  blue:   '#4060ff',
  white:  '#ffffff',
  yellow: '#ffd040',
  red:    '#ff3030',
};

export function conOf(playerLevel: number, spawnLevel: number): Con {
  if (!playerLevel || !spawnLevel) return 'white';
  const diff = spawnLevel - playerLevel;
  if (diff <= -9) return 'gray';
  if (diff <= -6) return 'green';
  if (diff <= -4) return 'cyan';
  if (diff <= -1) return 'blue';
  if (diff === 0) return 'white';
  if (diff <= 3)  return 'yellow';
  return 'red';
}

export function conHex(c: Con): string {
  return CON_HEX[c];
}
