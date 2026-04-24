import { useMemo, useState } from 'react';
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
import { conHex, conOf } from './concolor';
import { FILTERS } from './filterflags';

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
    header: 'Cls',
    size: 40,
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

export function SpawnList({
  store,
  tick,
  selectedId,
  onSelect,
}: {
  store: SpawnStore;
  tick: number;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'distance', desc: false },
  ]);
  // Bitmask of filter flags that will *hide* a matching spawn. A spawn is
  // hidden if any of its filter_flags bits are also set in `hidden`.
  const [hidden, setHidden] = useState<number>(1 << 5); // default: hide "Filtered"

  const rows = useMemo<Row[]>(() => {
    // `tick` is just a dependency to force recomputation each frame.
    void tick;
    const player = store.player();
    const pLevel = player?.level ?? 0;
    const out: Row[] = [];
    for (const s of store.all()) {
      if (s.type === SpawnType.DOOR || s.type === SpawnType.DROP) continue;
      if (hidden && (s.filterFlags & hidden) !== 0) continue;
      const d2 = player && s.id !== player.id ? distanceSq(s, player) : 0;
      const hpPct = s.hpMax > 0 ? (s.hpCur / s.hpMax) * 100 : -1;
      out.push({
        id: s.id,
        name: s.name || '(unnamed)',
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
  }, [store, hidden, tick]);

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const toggleFilter = (bit: number) => {
    setHidden((h) => h ^ bit);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-neutral-800 px-2 py-1.5">
        <div className="mb-1 text-xs font-medium text-neutral-400">Hide categories</div>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {FILTERS.map((f) => (
            <label
              key={f.bit}
              className="flex cursor-pointer items-center gap-1 text-[11px] text-neutral-300"
            >
              <input
                type="checkbox"
                checked={(hidden & f.bit) !== 0}
                onChange={() => toggleFilter(f.bit)}
                className="h-3 w-3 accent-blue-500"
              />
              {f.label}
            </label>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-b border-neutral-800 px-2 py-1 text-[11px] text-neutral-400">
        <span>{rows.length} spawn{rows.length === 1 ? '' : 's'}</span>
        <span>player lvl {store.player()?.level ?? '–'}</span>
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
              const isSelected = r.original.id === selectedId;
              return (
                <tr
                  key={r.id}
                  onClick={() => onSelect(r.original.id)}
                  className={
                    'cursor-pointer border-b border-neutral-900 ' +
                    (isSelected
                      ? 'bg-blue-900/40 hover:bg-blue-900/60'
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
