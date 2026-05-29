import { create } from 'zustand';

// Shared spawn-filter state for SpawnList + MapCanvas. Both surfaces
// apply the same predicate so dots on the map mirror rows in the list.
// Session-transient (not persisted) — these are interactive controls,
// not long-lived prefs.
//
//   categoryFilter:  -1 = "All spawns", else a CategoryMgr id
//   hideFiltered:    true = drop spawns with FILTERED_BIT in filterFlags
//   nameFilter:      substring match against "name + lastName" (case-insensitive)
//
// Selection does NOT pierce these filters — the user explicitly wants
// filtered spawns hidden. (Height filter still pierces for selection;
// that's a separate predicate.)

interface SpawnFilterState {
  categoryFilter: number;
  hideFiltered: boolean;
  nameFilter: string;

  setCategoryFilter: (v: number) => void;
  setHideFiltered: (v: boolean) => void;
  setNameFilter: (v: string) => void;
}

export const useSpawnFilterStore = create<SpawnFilterState>((set) => ({
  categoryFilter: -1,
  hideFiltered: true,
  nameFilter: '',
  setCategoryFilter: (v) => set({ categoryFilter: v }),
  setHideFiltered: (v) => set({ hideFiltered: v }),
  setNameFilter: (v) => set({ nameFilter: v }),
}));

// Shared `passesSpawnFilter` predicate. Returns true if the spawn should
// be visible given the current filter state. DOOR/DROP are excluded
// unconditionally (they're scenery, not actors). The caller is
// responsible for handling the selected-spawn pierce for OTHER filters
// (height, etc.) — this predicate does not pierce.
import { SpawnType } from '../gen/seq/v1/events_pb';

export const FILTERED_BIT = 1 << 5;

export interface FilterableSpawn {
  type: number;
  filterFlags: number;
  categoryIds: number[];
  name?: string;
  lastName?: string;
}

export function passesSpawnFilter(
  s: FilterableSpawn,
  state: { categoryFilter: number; hideFiltered: boolean; nameFilter: string },
): boolean {
  if (s.type === SpawnType.DOOR || s.type === SpawnType.DROP) return false;
  if (state.hideFiltered && (s.filterFlags & FILTERED_BIT) !== 0) return false;
  if (state.categoryFilter >= 0 && !s.categoryIds.includes(state.categoryFilter)) return false;
  const needle = state.nameFilter.trim().toLowerCase();
  if (needle) {
    const hay = `${s.name ?? ''} ${s.lastName ?? ''}`.toLowerCase();
    if (!hay.includes(needle)) return false;
  }
  return true;
}
