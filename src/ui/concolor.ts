// EQ con-color rules relative to a player level, ported to match the legacy
// client's Player::fillConTable (showeq/src/player.cpp) — and verified
// against the live client (a guild-hall dummy at known levels).
//
// Real EQ con is a flat level-delta band:
//   +4 or more : red        +1..+3 : yellow       even : white
//   -1..-5     : dark blue   -6..-15 : light blue
//   -16..-20   : green       -21 or more : grey
// ...but at low player levels there isn't room below you for the lower
// bands, so they compress: the grey/green thresholds scale with your level
// (the bucket table in conRanges), while dark-blue (-1..-5) and light-blue
// (ceiling level-6) stay fixed. e.g. at level 7 a level-1 mob (delta -6)
// cons GREY, not light blue, and lvls 2-6 are dark blue — exactly what the
// live client shows. By level 57 the table reaches the uncompressed bands.

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

// Per-level grey/green band offsets, identical to the legacy fillConTable
// bucket ladder. grayRange/greenRange are added to the player level to get
// the highest spawn level that cons grey / green respectively.
function conRanges(level: number): { grayRange: number; greenRange: number } {
  if (level < 15) return { grayRange: -6,  greenRange: -14 };
  if (level < 17) return { grayRange: -7,  greenRange: -5  };
  if (level < 21) return { grayRange: -8,  greenRange: -6  };
  if (level < 25) return { grayRange: -9,  greenRange: -7  };
  if (level < 29) return { grayRange: -10, greenRange: -8  };
  if (level < 33) return { grayRange: -11, greenRange: -9  };
  if (level < 37) return { grayRange: -13, greenRange: -10 };
  if (level < 41) return { grayRange: -14, greenRange: -11 };
  if (level < 45) return { grayRange: -16, greenRange: -12 };
  if (level < 49) return { grayRange: -17, greenRange: -13 };
  if (level < 53) return { grayRange: -18, greenRange: -14 };
  if (level < 57) return { grayRange: -20, greenRange: -15 };
  return { grayRange: -21, greenRange: -16 };
}

export function conOf(playerLevel: number, spawnLevel: number): Con {
  if (!playerLevel || !spawnLevel) return 'white';

  // At or above the player's level the bands are fixed (no compression).
  const diff = spawnLevel - playerLevel;
  if (diff >= 4) return 'red';
  if (diff >= 1) return 'yellow';
  if (diff === 0) return 'white';

  // Below the player, walk the same ordered ceilings fillConTable fills.
  // Because each band only claims spawn levels the previous bands didn't,
  // testing the ceilings in order grey -> green -> light-blue -> dark-blue
  // makes the lower bands compress out whenever a ceiling lands at or above
  // the spawn level (e.g. at low levels grayCeil swallows the light-blue
  // and green ranges entirely).
  const { grayRange, greenRange } = conRanges(playerLevel);
  const grayCeil  = grayRange + playerLevel;  // grey:       1 .. grayCeil
  const greenCeil = greenRange + playerLevel; // green:        .. greenCeil
  const cyanCeil  = playerLevel - 6;          // light blue:   .. level-6
  // dark blue fills the rest (level-5 .. level-1).

  if (spawnLevel <= grayCeil)  return 'gray';
  if (spawnLevel <= greenCeil) return 'green';
  if (spawnLevel <= cyanCeil)  return 'cyan';
  return 'blue';
}

export function conHex(c: Con): string {
  return CON_HEX[c];
}
