import { useEffect, useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import type { Spawn } from '@gen/seq/v1/events_pb';
import { SpawnType } from '@gen/seq/v1/events_pb';
import type { SpawnStore } from '../state/store';
import { CategorySelect } from './CategorySelect';
import { classNameOf } from './classes';
import { conHex, conOf } from './concolor';
import { tintForFilterFlags } from './filterflags';

type Row = {
  id: number;
  name: string;
  level: number;
  klass: number;
  hpPct: number;
  distance: number;
  conColor: string;
  filterFlags: number;
  type: number;
};

const columnHelper = createColumnHelper<Row>();

const columns = [
  columnHelper.accessor('conColor', {
    id: 'con',
    header: '',
    size: 12,
    cell: (info) => (
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ background: info.getValue() }}
      />
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('level', {
    header: 'Lvl',
    size: 40,
  }),
  columnHelper.accessor('klass', {
    header: 'Class',
    size: 80,
    // Full class name from showeq-daemon/src/classes.h — covers the 16
    // player classes, GM variants, and NPC service roles (Shopkeeper,
    // Banker, etc.). Untyped NPCs (id 0) render blank.
    cell: (info) => {
      const id = info.getValue();
      const name = classNameOf(id);
      return (
        <span className="block truncate" title={name}>{name}</span>
      );
    },
  }),
  columnHelper.accessor('hpPct', {
    header: 'HP',
    size: 50,
    cell: (info) => {
      const v = info.getValue();
      if (!Number.isFinite(v) || v < 0) return '–';
      return `${Math.round(v)}%`;
    },
  }),
  columnHelper.accessor('distance', {
    header: 'Dist',
    size: 60,
    cell: (info) => {
      const v = info.getValue();
      return Number.isFinite(v) ? v.toFixed(0) : '–';
    },
  }),
];

function distanceSq(a: Spawn, b: Spawn | undefined): number {
  if (!b?.pos || !a.pos) return Infinity;
  const dx = (a.pos.x ?? 0) - (b.pos.x ?? 0);
  const dy = (a.pos.y ?? 0) - (b.pos.y ?? 0);
  const dz = (a.pos.z ?? 0) - (b.pos.z ?? 0);
  return dx * dx + dy * dy + dz * dz;
}

// Refresh-rate presets (frames per minute) — matches the legacy
// showeq-c spawnlist2 spinbox (showeq/src/spawnlist2.cpp:97-101) but
// surfaced as discrete options instead of a free-form spinner so the
// header stays compact. 5 FPM = once every 12s, 60 FPM = once a
// second. Default 10 FPM (= every 6s) is the legacy default; on a
// busy zone the table reorders by distance every refresh so this
// directly controls how much main-thread work the panel does.
const FPM_OPTIONS = [5, 10, 15, 20, 30, 60] as const;
const FPM_DEFAULT = 10;

function loadFpm(): number {
  const raw = localStorage.getItem('spawnlist.fpm');
  const n = raw == null ? FPM_DEFAULT : Number(raw);
  if (!Number.isFinite(n)) return FPM_DEFAULT;
  return FPM_OPTIONS.includes(n as typeof FPM_OPTIONS[number]) ? n : FPM_DEFAULT;
}

export function SpawnList({
  store,
  selectedId,
  onSelect,
}: {
  store: SpawnStore;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'distance', desc: false },
  ]);
  // Filter mode: -1 = "All spawns", any non-negative integer = a
  // CategoryMgr category id (= index into the latest CategoriesUpdate)
  // that the spawn must match. Matches the showeq-c spawnlist2 category-
  // combo UX directly; user categories ship from seqdef.xml so the list
  // is non-empty by default.
  const [categoryFilter, setCategoryFilter] = useState<number>(-1);
  const [hideFiltered, setHideFiltered] = useState(true);
  // Row tints (Hunt/Caution/Danger/etc. backgrounds) are on by default.
  // Persisted because the preference is per-user, not per-session.
  const [rowTints, setRowTints] = useState<boolean>(
    () => localStorage.getItem('spawnlist.rowTints') !== '0',
  );
  const setRowTintsPersisted = (v: boolean) => {
    setRowTints(v);
    localStorage.setItem('spawnlist.rowTints', v ? '1' : '0');
  };
  const FILTERED_BIT = 1 << 5;
  const categoriesState = store.categoriesState();
  const categories = categoriesState?.categories ?? [];

  // Per-panel refresh ticker. SpawnList does its own setInterval here
  // rather than reading the global App tick — sorting + reconciling
  // hundreds of rows is the most expensive panel re-render in the
  // app, and the user should be able to dial it independently of
  // every other panel.
  const [fpm, setFpm] = useState<number>(loadFpm);
  useEffect(() => {
    localStorage.setItem('spawnlist.fpm', String(fpm));
  }, [fpm]);
  const [localTick, setLocalTick] = useState(0);
  useEffect(() => {
    const interval = Math.round(60_000 / fpm);
    const id = setInterval(() => setLocalTick((t) => t + 1), interval);
    return () => clearInterval(id);
  }, [fpm]);

  const rows = useMemo<Row[]>(() => {
    // `localTick` forces the row rebuild on the chosen FPM cadence.
    void localTick;
    const player = store.player();
    const pLevel = player?.level ?? 0;
    const out: Row[] = [];
    for (const s of store.all()) {
      if (s.type === SpawnType.DOOR || s.type === SpawnType.DROP) continue;
      if (hideFiltered && (s.filterFlags & FILTERED_BIT) !== 0) continue;
      if (categoryFilter >= 0 &&
          !s.categoryIds.includes(categoryFilter)) continue;
      const d2 = player && s.id !== player.id ? distanceSq(s, player) : 0;
      const hpPct = s.hpMax > 0 ? (s.hpCur / s.hpMax) * 100 : -1;
      // Match showeq-c spawnlistcommon.cpp:196 format: append the
      // last_name (NPC title / merchant role) in parentheses when set.
      const baseName = s.name || '(unnamed)';
      const display = s.lastName ? `${baseName} (${s.lastName})` : baseName;
      out.push({
        id: s.id,
        name: display,
        level: s.level,
        klass: s.class,
        hpPct,
        distance: Math.sqrt(d2),
        conColor: conHex(conOf(pLevel, s.level)),
        filterFlags: s.filterFlags,
        type: s.type,
      });
    }
    return out;
  }, [store, categoryFilter, hideFiltered, localTick]);

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    // Key rows by spawn id, not by data-array index. Without this every
    // spawn add/remove shifts every subsequent row's TanStack id, React
    // sees the whole tail of <tbody> as new, and the browser unmount/
    // remount churn dominates the per-tick cost (saw ~50 tr replacements
    // per second on a busy zone).
    getRowId: (row) => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-neutral-800 px-2 py-1.5 text-[11px] text-neutral-400">
        <div className="flex items-center gap-1">
          <span>Category</span>
          <CategorySelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { id: -1, name: 'All' },
              // Drop the seqdef Category1 "All" (regex ".") since our
              // synthetic id=-1 above already provides the same "no
              // filter" affordance — without this filter the dropdown
              // shows two entries labeled "All".
              ...categories
                .filter((c) => c.name !== 'All')
                .map((c) => ({
                  id: c.id,
                  name: c.name,
                  color: c.color || undefined,
                })),
            ]}
          />
        </div>
        <label className="flex cursor-pointer items-center gap-1">
          <input
            type="checkbox"
            checked={hideFiltered}
            onChange={(e) => setHideFiltered(e.target.checked)}
            className="h-3 w-3 accent-blue-500"
          />
          Hide Filtered
        </label>
        <label className="flex cursor-pointer items-center gap-1">
          <input
            type="checkbox"
            checked={rowTints}
            onChange={(e) => setRowTintsPersisted(e.target.checked)}
            className="h-3 w-3 accent-blue-500"
          />
          Tints
        </label>
      </div>
      <div className="flex items-center justify-between gap-2 border-b border-neutral-800 px-2 py-1 text-[11px] text-neutral-400">
        <span>{rows.length} spawn{rows.length === 1 ? '' : 's'}</span>
        <span>player lvl {store.player()?.level ?? '–'}</span>
        <label
          className="flex items-center gap-1"
          title="Refresh rate in frames per minute (5 = every 12s, 60 = every 1s). Mirrors legacy showeq-c spawnlist2 FPM spinbox."
        >
          <span className="text-neutral-500">FPM</span>
          <select
            value={fpm}
            onChange={(e) => setFpm(Number(e.target.value))}
            className="rounded border border-neutral-700 bg-bg-alt px-1 py-0.5 text-[11px] text-neutral-300"
          >
            {FPM_OPTIONS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </label>
      </div>
      {/*
        TODO(perf): virtualize this table with @tanstack/react-virtual.
        On busy zones we mount 300+ <tr>s and TanStack reorders by
        distance every refresh — only ~30 rows are ever visible. See
        NICE_TO_HAVE.md "Virtualize SpawnList". Current FPM control +
        stable getRowId keep this acceptable but it's still O(rows) per
        refresh.
      */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 bg-bg-alt">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const sort = h.column.getIsSorted();
                  return (
                    <th
                      key={h.id}
                      className="select-none px-1.5 py-1 text-left font-medium text-neutral-300"
                      style={{ width: h.getSize() }}
                      onClick={h.column.getToggleSortingHandler()}
                    >
                      <span className="cursor-pointer">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {sort === 'asc' ? ' ▲' : sort === 'desc' ? ' ▼' : ''}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((r) => {
              const isSelected = r.original.id === selectedId;
              const filterTint = rowTints
                ? tintForFilterFlags(r.original.filterFlags)
                : '';
              return (
                <tr
                  key={r.id}
                  onClick={() => onSelect(r.original.id)}
                  className={
                    'cursor-pointer border-b border-neutral-900 ' +
                    (isSelected
                      ? 'bg-blue-900/40 hover:bg-blue-900/60'
                      : filterTint
                      ? `${filterTint} hover:bg-bg-alt/60`
                      : 'hover:bg-bg-alt/60')
                  }
                >
                  {r.getVisibleCells().map((c) => (
                    <td key={c.id} className="px-1.5 py-0.5 align-middle">
                      {flexRender(c.column.columnDef.cell, c.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
