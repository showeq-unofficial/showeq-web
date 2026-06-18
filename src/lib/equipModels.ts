// Weapon visual model codes (spawn packet equipment slots 7-8).
// Ported from showeq/src/weapons.h. Index = model code byte from wire.
const WEAPON_MODELS: (string | null)[] = [
  "Generic",        // 0x00
  "1HSword",        // 0x01
  "2HSword",        // 0x02
  "Axe",            // 0x03
  "Bow",            // 0x04
  "Dagger",         // 0x05
  "Flute",          // 0x06
  "Mace",           // 0x07
  "2HStaff",        // 0x08
  "DwarvenAxe",     // 0x09
  "Arrow",          // 0x0a
  null, null, null, // 0x0b-0x0d
  "WarHammer",      // 0x0e
  "Trumpet",        // 0x0f
  "Spear",          // 0x10
  "ShortSpear",     // 0x11
  "Club",           // 0x12
  "MorningStar",    // 0x13
  "Rapier",         // 0x14
  "Lute",           // 0x15
  null,             // 0x16
  "Halberd",        // 0x17
  "2HHammer",       // 0x18
  "2HBattleAxe",    // 0x19
  "IcyBlade",       // 0x1a
  "Book",           // 0x1b
  "DarkBook",       // 0x1c
  "WrithingStaff",  // 0x1d
  null,             // 0x1e
  "SpikeClub",      // 0x1f
  "Broom",          // 0x20
  "HammFlat",       // 0x21
  "Shortsword",     // 0x22
  "Scepter",        // 0x23
  "Torch",          // 0x24
  "Cudgel",         // 0x25
  "Fishing Pole",   // 0x26
  "Scythe",         // 0x27
  "Harvester",      // 0x28
  "Scimitar",       // 0x29
  "Falchion",       // 0x2a
  "Pick",           // 0x2b
  null,             // 0x2c
  "CrystalStaff",   // 0x2d
  "BoneWand",       // 0x2e
  "Wand",           // 0x2f
  "Lantern",        // 0x30
  "Maul",           // 0x31
  "Dirk",           // 0x32
  "GoldScepter",    // 0x33
  "Shovel",         // 0x34
  "Flamberge",      // 0x35
  null,             // 0x36
  "Pipe",           // 0x37
  "Stein",          // 0x38
  "BroadSword",     // 0x39
  "BastardSword",   // 0x3a
  "MiningPick",     // 0x3b
  "BattleAxe",      // 0x3c
  "Whip",           // 0x3d
  "FlameSword",     // 0x3e
  "Generic",        // 0x3f
  "Generic",        // 0x40
  "Letter",         // 0x41
  "Forge",          // 0x42
  "Doll",           // 0x43
  "Manastone",      // 0x44
  "Oven",           // 0x45
  "BrewBarrel",     // 0x46
  "Claws",          // 0x47
  "Stone",          // 0x48
  "Kiln",           // 0x49
  "PotteryWheel",   // 0x4a
  "WoodenCrook",    // 0x4b
  "Vah Shir Sword", // 0x4c
  null, null, null, // 0x4d-0x4f
  "ExecutionerAxe", // 0x50
  "Lamentation",    // 0x51
  "Fer'Esh",        // 0x52
  "Silver2HAxe",    // 0x53
  "GreatCleaver",   // 0x54
  "SerratedSword",  // 0x55
  "Falchion",       // 0x56
  "YkeshaSS",       // 0x57
  "Swarmcaller",    // 0x58
  null,             // 0x59
  "SwordPassage",   // 0x5a
  "Ulak",           // 0x5b
  "Wurmslayer",     // 0x5c
  null,             // 0x5d
  "Duster/Sapper",  // 0x5e
  "YkeshaTB",       // 0x5f
  null, null,       // 0x60-0x61
  "Tooth",          // 0x62
  "Bladecatcher",   // 0x63
  "SheerBlade",     // 0x64
  "Ketchata",       // 0x65
  null,             // 0x66
  "PartisanSpear",  // 0x67
  "KunzarKu'juch",  // 0x68
  "Shan'Tok",       // 0x69
  null, null,       // 0x6a-0x6b
  "Sword",          // 0x6c
  null,             // 0x6d
  "LegChopper",     // 0x6e
  null, null,       // 0x6f-0x70
  "Ta'Nak",         // 0x71
  null,             // 0x72
  "Mallet",         // 0x73
  null,             // 0x74
  "Re'Stek",        // 0x75
  "Envy",           // 0x76
  "LupineDagger",   // 0x77
  "BlackTranslucentBlade", // 0x78
  "WhiteTranslucentBlade", // 0x79
  "Velium2hStaff",  // 0x7a
  "Ch'Ror",         // 0x7b
  null,             // 0x7c
  "SarnakSkullStaff", // 0x7d
  "WoodStaff",      // 0x7e
  null,             // 0x7f
  "Loom",           // 0x80
  null,             // 0x81
  "MorningStar",    // 0x82
  "Defiance",       // 0x83
  "Harpoon",        // 0x84
  "Bowl",           // 0x85
  null, null,       // 0x86-0x87
  "Claw",           // 0x88
  "Tambourine",     // 0x89
  null, null,       // 0x8a-0x8b
  "Ragebringer",    // 0x8c
  "WarEpic1hBlue",  // 0x8d
  "WarEpic1hRed",   // 0x8e
  null, null, null, null, null, // 0x8f-0x93
  "BardEpic",       // 0x94
  "RangerEpic",     // 0x95
  "DruidEpic",      // 0x96
  "MageEpic",       // 0x97
  null,             // 0x98
  "NecroEpic",      // 0x99
  "ShamanEpic",     // 0x9a
  "WizardEpic",     // 0x9b
  "ClericEpic",     // 0x9c
  "EncEpic",        // 0x9d
  null,             // 0x9e
  "MonkEpic",       // 0x9f
  "PaladinEpic",    // 0xa0
  null, null,       // 0xa1-0xa2
  "RedJeweledSword", // 0xa3
  "BlueJeweledSword", // 0xa4
  null,             // 0xa5
  "ShissarEmperorsSword", // 0xa6
  "JeweledDirk",    // 0xa7
  "VeliumSword",    // 0xa8
  null,             // 0xa9
  "Velium2hAxe",    // 0xaa
  "VeliumAxe",      // 0xab
  "VeliumSpear",    // 0xac
  null, null, null, null, null, // 0xad-0xb1
  "VeliumAltHammer", // 0xb2
  "VeliumHammer",   // 0xb3
  "CrystalSword",   // 0xb4
  null, null, null, null, null, // 0xb5-0xb8
  "GoldHammer",     // 0xb9
  "VeliumGreatStaff", // 0xba
  "VeliumSpear",    // 0xbb
  "VeliumLongSword", // 0xbc
  "VeliumMorningStar", // 0xbd
  "VeliumTwoHandedSword", // 0xbe
  "VeliumShortSword", // 0xbf
  "VeliumScimitar", // 0xc0
  "VeliumWarhammer", // 0xc1
  "VeliumDagger",   // 0xc2
  "VeliumRapier",   // 0xc3
  null,             // 0xc4
  "VeliumLance",    // 0xc5
  "BFG",            // 0xc6
  "Crossbow",       // 0xc7
  "QeynosShield",   // 0xc8
  "WoodenShield",   // 0xc9
  "KiteShield",     // 0xca
  "SmRoundShield",  // 0xcb
  "DarkwoodShield", // 0xcc
  "BoneShield",     // 0xcd
  "DarkShield",     // 0xce
  "MarrsPromise",   // 0xcf
  null,             // 0xd0
  "ShellShield1",   // 0xd1
  "ShimmerOrb",     // 0xd2
  "UnicornShield",  // 0xd3
  "NautilusShield", // 0xd4
  "MistmooreShield", // 0xd5
  "ChitinShield",   // 0xd6
  "FearShield",     // 0xd7
  "IksTargShield",  // 0xd8
  "FrogskinShield", // 0xd9
  "ScaleShield",    // 0xda
  "ShellShield2",   // 0xdb
  null,             // 0xdc
  "SarnakShield",   // 0xdd
  null,             // 0xde
  "OrnateRunedShield", // 0xdf
  null, null,       // 0xe0-0xe1
  "GreyShield",     // 0xe2
  null,             // 0xe3
  "VeliumRoundShield", // 0xe4
  null,             // 0xe5
  "Vah Shir Shield", // 0xe6
];

// Armor material codes (spawn packet slots 0-6: Head/Chest/Arms/Waist/Gloves/Legs/Feet).
// Ported from showeq/src/util.cpp::print_material().
const ARMOR_MATERIALS: (string | null)[] = [
  null,             // 0x00 — "None" / bare skin, don't display
  "Leather",        // 0x01
  "Ringmail",       // 0x02
  "Plate",          // 0x03
  "Cured Silk",     // 0x04
  "Chitin",         // 0x05
  null,             // 0x06
  "Scale",          // 0x07
  null, null,       // 0x08-0x09
  "ElementRobe",    // 0x0a
  "BlightedRobe",   // 0x0b
  "Crystalline",    // 0x0c
  "OracleRobe",     // 0x0d
  "KedgeRobe",      // 0x0e
  "MetallicRobe",   // 0x0f
  "Robe",           // 0x10
  "VeliousLeather", // 0x11
  "VeliousChain",   // 0x12
  "PogPlate",       // 0x13
  "Ulthork/Tizmak", // 0x14
  "Ry'Gorr",        // 0x15
  "Kael/Guardian",  // 0x16
  "VeliousMonk",    // 0x17
];

const SLOT_LABELS: string[] = ["H", "C", "A", "W", "G", "L", "F", "1", "2"];

export function weaponModelName(code: number): string {
  return WEAPON_MODELS[code] ?? `#${code}`;
}

export function armorMaterialName(code: number): string {
  return ARMOR_MATERIALS[code] ?? `#${code}`;
}

export function slotLabel(slot: number): string {
  return SLOT_LABELS[slot] ?? `S${slot}`;
}

// Returns a display string for one slot. Armor slots (0-6) use material names;
// weapon slots (7-8) use weapon model names. Returns empty string for bare/empty.
export function equipSlotDisplay(slot: number, modelCode: number): string {
  if (modelCode === 0) return '';
  if (slot <= 6) return armorMaterialName(modelCode) ?? '';
  return weaponModelName(modelCode);
}

// Legacy-style compact summary, e.g. "C:Leather 1:MorningStar 2:IksTargShield"
export function equipSummary(models: number[]): string {
  const parts: string[] = [];
  for (let i = 0; i < Math.min(models.length, 9); i++) {
    const display = equipSlotDisplay(i, models[i]);
    if (display) parts.push(`${slotLabel(i)}:${display}`);
  }
  return parts.join(' ');
}
