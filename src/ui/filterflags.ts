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

// Tailwind background tint for a spawn-list row whose spawn matches
// this filter type. Highest-priority match (lowest priority value)
// wins. Filtered/Tracer aren't highlighted — they're more like
// hide/debug categories than "draw the user's attention" states.
export const FILTER_ROW_TINT: { bit: number; tint: string; priority: number }[] = [
  { bit: 1 << 2, tint: 'bg-red-900/40',     priority: 0 }, // Danger — strongest
  { bit: 1 << 1, tint: 'bg-amber-900/40',   priority: 1 }, // Caution
  { bit: 1 << 4, tint: 'bg-fuchsia-900/40', priority: 2 }, // Alert
  { bit: 1 << 0, tint: 'bg-emerald-900/40', priority: 3 }, // Hunt — confirmed target
  { bit: 1 << 3, tint: 'bg-blue-900/30',    priority: 4 }, // Locate — informational
];

export function tintForFilterFlags(flags: number): string {
  for (const f of FILTER_ROW_TINT) {
    if (flags & f.bit) return f.tint;
  }
  return '';
}
