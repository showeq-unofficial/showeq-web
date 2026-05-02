// Skill cap lookup. EQ doesn't send skill caps over the wire — the client
// computes them from (class, level, skill_id). Live EQ caps are
// piecewise: a per-(class, skill) growth formula until a hard ceiling is
// hit, then plateau. Calibrated against L3 + L60 magician dumps; refine
// per-class as you walk other characters through.
//
// Returns undefined when the skill isn't available to the class — caller
// uses that to hide the row entirely.

type CapFn = (level: number) => number;

const min = Math.min;

// Universal skills — available to (almost) every class with the same
// formula. Per the L60 magician dump: Bind Wound and Alcohol Tolerance
// hit 325 (= 5*l + 25 at L60), Swimming hits 300 (= 5*l at L60), Sense
// Heading is flat 200. Dodge moved to class-specific because its cap
// varies (magician dodge plateaus at 205 long before L60).
const UNIVERSAL: Record<number, CapFn> = {
  9:  (l) => 5 * l + 25,    // Bind Wound        — 40 @ L3, 325 @ L60
  40: () => 200,            // Sense Heading     — flat 200
  50: (l) => 5 * l,         // Swimming          — 15 @ L3, 300 @ L60
  66: (l) => 5 * l + 25,    // Alcohol Tolerance — 40 @ L3, 325 @ L60
};

// Tradeskills — flat caps. L60 magician confirmed Tinkering and
// Research both at 300 on live (legacy 250/200 was wrong).
const TRADESKILLS: Record<number, number> = {
  55: 200,  // Fishing
  56: 250,  // Make Poison (rogue) — L60 confirmation pending
  57: 300,  // Tinkering           — confirmed L60 magician
  58: 300,  // Research            — confirmed L60 magician
  59: 250,  // Alchemy   (shaman)  — L60 confirmation pending
  60: 300,  // Baking
  61: 300,  // Tailoring
  63: 300,  // Blacksmithing
  64: 300,  // Fletching
  65: 300,  // Brewing
  68: 300,  // Jewelry Making
  69: 300,  // Pottery
};

// Class-specific skill formulas. Each entry is a CapFn returning the cap
// for a given level. Most entries follow `min(growth(l), MAX)` — the
// growth rate matches early-level data, MAX matches the L60 plateau.
const CLASS_SKILLS: Record<number, Record<number, CapFn>> = {
  // 1: Warrior
  1: {
    0: (l) => 10 * l, 1: (l) => 10 * l, 2: (l) => 10 * l, 3: (l) => 10 * l,
    7: (l) => 10 * l,
    10: (l) => 5 * l,
    11: (l) => 5 * l,
    15: (l) => 5 * l, 19: (l) => 5 * l, 20: (l) => 5 * l,
    22: (l) => l + 17,
    28: (l) => 10 * l,
    30: (l) => 5 * l + 5,
    33: (l) => 5 * l,
    34: (l) => 5 * l,
    36: (l) => 10 * l,
    37: (l) => 5 * l,
    51: (l) => 5 * l + 10,
    67: (l) => 5 * l,
    73: (l) => 5 * l,
  },
  // 7: Monk — calibrated against user's level-2 dump
  7: {
    0: (l) => 10 * l, 2: (l) => 10 * l,
    11: (l) => 5 * l,
    15: (l) => 5 * l,
    16: (l) => 5 * l,
    19: (l) => 5 * l,
    22: (l) => Math.max(17, l + 17),
    25: (l) => 5 * l,
    28: (l) => 10 * l,
    29: (l) => 5 * l,
    30: (l) => 5 * l + 5,
    32: (l) => 5 * l + 5,
    33: (l) => 5 * l,
    34: (l) => 5 * l,
    37: (l) => 5 * l,
    38: (l) => 5 * l + 5,
    39: (l) => 5 * l + 5,
    42: (l) => 5 * l,
    51: (l) => 5 * l + 10,
    52: (l) => 5 * l,
    67: (l) => 5 * l,
  },
  // 9: Rogue
  9: {
    1: (l) => 10 * l, 36: (l) => 10 * l,
    7: (l) => 10 * l,
    8: (l) => 5 * l,
    11: (l) => 5 * l,
    15: (l) => 5 * l, 16: (l) => 5 * l, 17: (l) => 5 * l,
    19: (l) => 5 * l, 22: (l) => Math.max(17, l + 17),
    29: (l) => 5 * l,
    33: (l) => 5 * l, 35: (l) => 5 * l, 37: (l) => 5 * l,
    42: (l) => 5 * l, 48: (l) => 5 * l,
    51: (l) => 5 * l + 10,
    62: (l) => 5 * l,
  },
  // 13: Magician — calibrated against L3 + L60 dumps. Most caster
  // skills cap mid-game: e.g. casting schools grow 5*l+5 until hitting
  // 285 around L56. Specializations are handled separately because the
  // primary spec gets a higher ceiling (235) than non-primary (135) —
  // see PRIMARY_SPEC_CAP / NON_PRIMARY_SPEC_CAP below.
  13: {
    0:  (l) => min(4 * l, 225),       // 1H Blunt:    12 @ L3, 225 @ L60
    2:  (l) => min(4 * l, 225),       // 2H Blunt
    36: (l) => min(4 * l, 225),       // 1H Piercing
    15: (l) => min(5 * l, 230),       // Defense:     15 @ L3, 230 @ L60
    19: (l) => min(5 * l, 205),       // Dodge:       205 @ L60
    28: (l) => 3 * l,                  // Hand to Hand: 9 @ L3, 180 @ L60
    33: (l) => min(4 * l, 140),       // Offense:     12 @ L3, 140 @ L60
    51: (l) => min(5 * l + 15, 280),  // Throwing:    30 @ L3, 280 @ L60
    4:  (l) => min(5 * l + 5, 285),   // Abjuration:  20 @ L3, 285 @ L60
    5:  (l) => min(5 * l + 5, 285),   // Alteration
    13: (l) => min(5 * l + 5, 220),   // Channeling:  20 @ L3, 220 @ L60
    14: (l) => min(5 * l + 5, 285),   // Conjuration
    18: (l) => min(5 * l + 5, 285),   // Divination
    24: (l) => min(5 * l + 5, 285),   // Evocation
    31: (l) => min(5 * l + 15, 325),  // Meditate:    30 @ L3, 325 @ L60
    67: (l) => 5 * l,                  // Begging:     15 @ L3, 300 @ L60
    // Specializations: skill ids 43..47. Cap is set in skillCap() based
    // on whether this is the player's chosen primary spec.
  },
  // 16: Berserker — similar to warrior
  16: {
    2: (l) => 10 * l, 3: (l) => 10 * l,
    7: (l) => 10 * l, 19: (l) => 5 * l, 20: (l) => 5 * l,
    33: (l) => 5 * l, 34: (l) => 5 * l, 51: (l) => 10 * l,
    72: (l) => 5 * l,
    74: (l) => 5 * l,
  },
};

// Specialization caps per class. Live EQ doesn't store a "primary spec"
// flag in the profile — the player picks one implicitly by raising it
// past the non-primary ceiling. We surface that asymmetry here. Only
// pure casters get specializations.
const SPEC_SKILLS = new Set([43, 44, 45, 46, 47]);
const NON_PRIMARY_SPEC_CAP: CapFn = (l) => min(5 * l + 5, 135);
const PRIMARY_SPEC_CAP:     CapFn = (l) => min(5 * l + 5, 235);
// Classes that get specializations: cleric(2), druid(6), shaman(10),
// necromancer(11), wizard(12), magician(13), enchanter(14).
const SPEC_CLASSES = new Set([2, 6, 10, 11, 12, 13, 14]);

// Heuristic: primary spec is whichever specialization the player has
// trained past the non-primary cap (135). Returns undefined if the
// player hasn't established a primary yet (all specs ≤ 135).
export function findPrimarySpec(
  skills: ReadonlyArray<{ skillId: number; value: number }>,
  classId: number,
  level: number,
): number | undefined {
  if (!SPEC_CLASSES.has(classId)) return undefined;
  const npCap = NON_PRIMARY_SPEC_CAP(level);
  let best: { skillId: number; value: number } | undefined;
  for (const s of skills) {
    if (!SPEC_SKILLS.has(s.skillId)) continue;
    if (s.value <= npCap) continue;
    if (!best || s.value > best.value) best = s;
  }
  return best?.skillId;
}

export function skillCap(
  skillId: number,
  classId: number,
  level: number,
  primarySpecId?: number,
): number | undefined {
  // GM class variants (20..35) share the parent class' resource model.
  if (classId >= 20 && classId <= 35) classId -= 19;

  if (SPEC_SKILLS.has(skillId)) {
    if (!SPEC_CLASSES.has(classId)) return undefined;
    return skillId === primarySpecId
      ? PRIMARY_SPEC_CAP(level)
      : NON_PRIMARY_SPEC_CAP(level);
  }

  if (TRADESKILLS[skillId] !== undefined) return TRADESKILLS[skillId];
  if (UNIVERSAL[skillId] !== undefined) return UNIVERSAL[skillId](level);

  const fn = CLASS_SKILLS[classId]?.[skillId];
  return fn ? fn(level) : undefined;
}
