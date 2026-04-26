import { useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import type { SpawnStore } from '../state/store';

// Mirrors showeq-c spawnpointlist.cpp's column model: x/y/z, the
// remaining time until the next pop, the user-assigned name (if any),
// the most-recently-spawned mob, and the running count of pops we've
// observed. Time math is local — the daemon ships epoch seconds and
// the cycle length, the client ticks down off the wall clock.
type Row = {
  key: string;
  x: number;
  y: number;
  z: number;
  name: string;
  last: string;
  count: number;
  // null when we don't yet have both diff_time_s and death_time_s set;
  // the legacy UI rendered this as upside-down-question-mark + question
  // mark. We just show "?".
  remainingS: number | null;
  // Used to bold + redden the row when the mob is way overdue, mirroring
  // the legacy SpawnPointListItem::data ForegroundRole branch (age > 220
  // → red). With a max age of 255 that's effectively "spawn point is
  // 220/255 of one cycle past due".
  age: number;
};

const columnHelper = createColumnHelper<Row>();

function fmtRemaining(s: number | null): string {
  if (s === null) return '?';
  if (s <= 0) return '  now';
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, '0')}`;
}

const columns = [
  columnHelper.accessor('x', { header: 'X', size: 60 }),
  columnHelper.accessor('y', { header: 'Y', size: 60 }),
  columnHelper.accessor('z', {
    header: 'Z',
    size: 60,
    cell: (info) => info.getValue().toFixed(1),
  }),
  columnHelper.accessor('remainingS', {
    header: 'Remaining',
    size: 80,
    cell: (info) => (
      <span className="font-mono">{fmtRemaining(info.getValue())}</span>
    ),
    sortingFn: (a, b) => {
      // null sorts last so unknown-cycle points settle at the bottom.
      const av = a.original.remainingS;
      const bv = b.original.remainingS;
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      return av - bv;
    },
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue() || '—',
  }),
  columnHelper.accessor('last', {
    header: 'Last',
    cell: (info) => info.getValue() || '—',
  }),
  columnHelper.accessor('count', { header: 'Count', size: 60 }),
];

export function SpawnPointList({
  store,
  tick,
}: {
  store: SpawnStore;
  tick: number;
}) {
  // Default sort matches showeq-c: ascending by remaining time so the
  // next-to-pop is at the top.
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'remainingS', desc: false },
  ]);

  const rows = useMemo<Row[]>(() => {
    void tick;
    const nowS = Math.floor(Date.now() / 1000);
    return store.allSpawnPoints().map((sp) => {
      // Daemon ships uint64s as bigints. Coerce to plain numbers — EQ
      // wall-clock seconds fit in a double well past any plausible
      // session length.
      const death = Number(sp.deathTimeS);
      const diff = Number(sp.diffTimeS);
      let remaining: number | null = null;
      let age = 0;
      if (death !== 0 && diff !== 0) {
        remaining = diff - (nowS - death);
        // Mirrors SpawnPoint::age in showeq-c: 255 * (now-death)/diff,
        // clamped, used to redden heavily-overdue rows.
        age = Math.min(255, Math.max(0, Math.floor((255 * (nowS - death)) / diff)));
      }
      const row: Row = {
        key: sp.key,
        x: sp.x,
        y: sp.y,
        z: sp.z,
        name: sp.name,
        last: sp.last,
        count: sp.count,
        remainingS: remaining,
        age,
      };
      return row;
    });
  }, [store, tick]);

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-neutral-800 px-2 py-1 text-[11px] text-neutral-400">
        <span>{rows.length} spawn point{rows.length === 1 ? '' : 's'}</span>
        <span className="font-mono">
          {rows.filter((r) => r.remainingS !== null && r.remainingS <= 0).length}
          {' '}up
        </span>
      </div>
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
              // Legacy rule: bold + red text when the mob is heavily
              // overdue (age > 220 ≈ 86% past cycle).
              const overdue = r.original.age > 220;
              return (
                <tr
                  key={r.id}
                  className={
                    'border-b border-neutral-900 ' +
                    (overdue
                      ? 'font-bold text-red-400 hover:bg-bg-alt/60'
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
