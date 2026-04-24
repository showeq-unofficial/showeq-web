// Mirrors the player-class lookup in showeq-daemon/src/classes.h.
// Only the 16 player classes — GMs and NPC types are out of scope for
// the stats panel.
const CLASSES: Record<number, string> = {
  1:  'Warrior',
  2:  'Cleric',
  3:  'Paladin',
  4:  'Ranger',
  5:  'Shadow Knight',
  6:  'Druid',
  7:  'Monk',
  8:  'Bard',
  9:  'Rogue',
  10: 'Shaman',
  11: 'Necromancer',
  12: 'Wizard',
  13: 'Magician',
  14: 'Enchanter',
  15: 'Beastlord',
  16: 'Berserker',
};

export function classNameOf(id: number): string {
  return CLASSES[id] ?? '';
}
