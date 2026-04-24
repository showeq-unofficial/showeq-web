// Mirrors showeq-daemon/src/filtermgr.h filter-type indices. The Spawn
// proto's filter_flags field is a bitmask of (1 << index).

export const FILTERS = [
  { bit: 1 << 0, label: 'Hunt' },
  { bit: 1 << 1, label: 'Caution' },
  { bit: 1 << 2, label: 'Danger' },
  { bit: 1 << 3, label: 'Locate' },
  { bit: 1 << 4, label: 'Alert' },
  { bit: 1 << 5, label: 'Filtered' },
  { bit: 1 << 6, label: 'Tracer' },
] as const;
