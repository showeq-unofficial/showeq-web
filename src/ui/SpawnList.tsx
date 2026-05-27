import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnSizingState,
  type SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
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
  // TLP mob-lock / FTE: true = locked/unattackable (claimed by another player
  // or the brief post-spawn grey window). Always false on standard Live.
  locked: boolean;
};

const columnHelper = createColumnHelper<Row>();

const columns = [
  columnHelper.accessor('conColor', {
    id: 'con',
    header: '',
    size: 16,
    cell: (info) => (
      <span
        className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-border"
        style={{ background: info.getValue() }}
      />
    ),
    enableSorting: false,
    // Just a colored dot; resizing it would add zero value.
    enableResizing: false,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => (
      <span className="flex items-center gap-1">
        {info.row.original.locked && (
          <span title="Locked — claimed by another player (unattackable)" aria-label="locked">
            🔒
          </span>
        )}
        <span className="truncate">{info.getValue()}</span>
      </span>
    ),
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
// second. Default 10 FPM (= every 6s) is the legacy default. Rows are
// sorted by distance, so this controls how often the list visibly
// reorders as you/mobs move — low FPM = stable list (easier to click
// a target without it swapping with a neighbor mid-click), high FPM =
// snappy reorder. Row virtualization makes the per-tick cost flat in
// spawn count, so this is a UX/readability dial rather than a perf
// throttle.
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
  // User-resized column widths, persisted so the layout survives reload.
  // Keys are column ids; values are pixel widths. Empty object means
  // "use the column's default size" — the default sizes are still set
  // on each column above so a fresh user gets the legacy layout.
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() => {
    try {
      const raw = localStorage.getItem('spawnlist.colWidths');
      return raw ? (JSON.parse(raw) as ColumnSizingState) : {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    localStorage.setItem('spawnlist.colWidths', JSON.stringify(columnSizing));
  }, [columnSizing]);
  // Filter mode: -1 = "All spawns", any non-negative integer = a
  // CategoryMgr category id (= index into the latest CategoriesUpdate)
  // that the spawn must match. Matches the showeq-c spawnlist2 category-
  // combo UX directly; user categories ship from seqdef.xml so the list
  // is non-empty by default.
  const [categoryFilter, setCategoryFilter] = useState<number>(-1);
  const [hideFiltered, setHideFiltered] = useState(true);
  const [nameFilter, setNameFilter] = useState('');
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
  // rather than reading the global App tick because the user-visible
  // effect of this rate (how often distance-sorted rows shuffle) is
  // specific to this panel — they may want a stable, slow-reordering
  // list here while other panels stay snappy. Per-tick cost is bounded
  // by virtualization, so this isn't a perf knob.
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
    // Prefer PlayerStats.level over Spawn.level: the daemon updates
    // PlayerStats on OP_LevelUpdate (via levelChanged → onPlayerStatsChanged)
    // but never resends the player's Spawn record, so Spawn.level is frozen
    // at zone-in and con colors would otherwise drift after a ding.
    const pLevel = store.stats()?.level ?? player?.level ?? 0;
    const needle = nameFilter.trim().toLowerCase();
    const out: Row[] = [];
    for (const s of store.all()) {
      if (player && s.id === player.id) continue;
      if (s.type === SpawnType.DOOR || s.type === SpawnType.DROP) continue;
      if (hideFiltered && (s.filterFlags & FILTERED_BIT) !== 0) continue;
      if (categoryFilter >= 0 &&
          !s.categoryIds.includes(categoryFilter)) continue;
      if (needle) {
        const hay = `${s.name ?? ''} ${s.lastName ?? ''}`.toLowerCase();
        if (!hay.includes(needle)) continue;
      }
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
        locked: s.locked ?? false,
      });
    }
    return out;
  }, [store, categoryFilter, hideFiltered, nameFilter, localTick]);

  // Player row is rendered separately so it stays pinned at the top of
  // the table regardless of sort and scroll position. HP comes from
  // store.stats() — the player's spawn record carries raw HP against
  // hpMax=100, which would render as "1245%" if used directly.
  const playerRow = useMemo<Row | null>(() => {
    void localTick;
    const player = store.player();
    const stats = store.stats();
    if (!player) return null;
    const hpCur = stats?.hpCur ?? 0;
    const hpMax = stats?.hpMax ?? 0;
    const hpPct = hpMax > 0 ? (hpCur / hpMax) * 100 : -1;
    const lvl = stats?.level ?? player.level ?? 0;
    const baseName = stats?.name || player.name || '(you)';
    return {
      id: player.id,
      name: baseName,
      level: lvl,
      klass: stats?.class ?? player.class,
      hpPct,
      distance: 0,
      conColor: conHex(conOf(lvl, lvl)),
      filterFlags: player.filterFlags,
      type: player.type,
      locked: false,
    };
  }, [store, localTick]);

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, columnSizing },
    onSortingChange: setSorting,
    onColumnSizingChange: setColumnSizing,
    // 'onChange' updates widths live during the drag; 'onEnd' would only
    // commit on mouseup, which feels laggy for our small table.
    columnResizeMode: 'onChange',
    enableColumnResizing: true,
    // Key rows by spawn id, not by data-array index. Without this every
    // spawn add/remove shifts every subsequent row's TanStack id, React
    // sees the whole tail of <tbody> as new, and the browser unmount/
    // remount churn dominates the per-tick cost (saw ~50 tr replacements
    // per second on a busy zone).
    getRowId: (row) => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Row virtualization. With 5000+ spawns the unvirtualized <tbody>
  // pegged the main thread for ~600ms per refresh tick, blocking rAF and
  // collapsing the canvas paint rate to ~2fps. Only ~30 rows are ever
  // visible — virtualizing turns this into a bounded ~30-tr render.
  const sortedRows = table.getRowModel().rows;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  // Fixed row height keeps column widths aligned across virtual rows
  // without per-row measurement cost. 22px = text-xs (~18px line-height)
  // + py-0.5 (4px) + 1px border. Set as inline tr height below to lock.
  const ROW_HEIGHT = 22;
  const virtualizer = useVirtualizer({
    count: sortedRows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });
  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const padTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const padBot = virtualItems.length > 0
    ? totalSize - virtualItems[virtualItems.length - 1].end
    : 0;

  // Auto-scroll to the selected row whenever the selection or its
  // position in the sorted list changes. `align: 'center'` keeps the
  // row visible past the sticky thead + player row at the top — using
  // 'start' would tuck it under those overlays. Rows churn position on
  // every refresh tick (sorted by distance), so this also keeps the
  // selection in sight as you/the mob move.
  const selectedIdx = useMemo(() => {
    if (selectedId == null) return -1;
    return sortedRows.findIndex((r) => r.original.id === selectedId);
  }, [selectedId, sortedRows]);
  useEffect(() => {
    if (selectedIdx < 0) return;
    virtualizer.scrollToIndex(selectedIdx, { align: 'center' });
    // virtualizer instance is stable across renders; depending on it
    // would re-fire only when a new instance is constructed (never in
    // normal use), but ESLint can't see that — exclude it deliberately.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIdx]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-2 py-1.5 text-[11px] text-muted-foreground">
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
        <div className="ml-auto flex items-center gap-1">
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Filter name…"
            aria-label="Filter spawn list by name"
            className="w-32 rounded border border-border bg-bg-alt px-1.5 py-0.5 text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {nameFilter && (
            <button
              type="button"
              onClick={() => setNameFilter('')}
              aria-label="Clear filter"
              title="Clear filter"
              className="rounded px-1 text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 border-b border-border px-2 py-1 text-[11px] text-muted-foreground">
        <span>{rows.length} spawn{rows.length === 1 ? '' : 's'}</span>
        <label
          className="flex items-center gap-1"
          title="Distance-sort cadence in frames per minute (5 = every 12s, 60 = every 1s). Lower FPM = more stable rows; higher FPM = faster reorder. Mirrors legacy showeq-c spawnlist2 FPM spinbox."
        >
          <span className="text-muted-foreground">FPM</span>
          <select
            value={fpm}
            onChange={(e) => setFpm(Number(e.target.value))}
            className="rounded border border-border bg-bg-alt px-1 py-0.5 text-[11px] text-foreground"
          >
            {FPM_OPTIONS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </label>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-auto">
        {/*
          table-fixed locks column widths to the first row's <th> sizes
          so virtual rows (rendered in slices as the user scrolls) line
          up regardless of which rows are mounted. Without it, the
          browser would re-balance column widths every time the visible
          slice changes and rows would visibly jitter horizontally.
        */}
        <table className="w-full table-fixed border-collapse text-xs">
          <thead className="sticky top-0 z-[2] bg-bg-alt">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const sort = h.column.getIsSorted();
                  const canResize = h.column.getCanResize();
                  return (
                    <th
                      key={h.id}
                      className="relative select-none px-1.5 py-1 text-left font-medium text-foreground"
                      style={{ width: h.getSize() }}
                    >
                      <span
                        className="cursor-pointer"
                        onClick={h.column.getToggleSortingHandler()}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {sort === 'asc' ? ' ▲' : sort === 'desc' ? ' ▼' : ''}
                      </span>
                      {canResize && (
                        // Drag handle: thin column-edge strip. Stops
                        // mousedown propagation so dragging doesn't also
                        // trigger the sort toggle on the header span.
                        // touch-none disables touch scrolling so a drag
                        // on mobile doesn't turn into a page-scroll
                        // gesture.
                        <span
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            h.getResizeHandler()(e);
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            h.getResizeHandler()(e);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={
                            'absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none ' +
                            (h.column.getIsResizing()
                              ? 'bg-primary'
                              : 'hover:bg-primary/60')
                          }
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {playerRow && (() => {
              // position:sticky doesn't apply to <tr> in table layouts,
              // so we sticky each <td>. Top offset ≈ thead row height
              // (text-xs + py-1 ≈ 24px). Background must be fully
              // opaque since rows scroll under this one.
              const isSelected = playerRow.id === selectedId;
              const stickyCell =
                'sticky top-6 z-[1] px-1.5 py-0.5 align-middle ' +
                (isSelected
                  ? 'bg-primary/30'
                  : 'bg-bg-alt');
              return (
                <tr
                  onClick={() => onSelect(playerRow.id)}
                  className="cursor-pointer font-semibold text-amber-200"
                >
                  <td className={stickyCell}>
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-border"
                      style={{ background: playerRow.conColor }}
                    />
                  </td>
                  <td className={stickyCell}>{playerRow.name}</td>
                  <td className={stickyCell}>{playerRow.level}</td>
                  <td className={stickyCell}>
                    <span
                      className="block truncate"
                      title={classNameOf(playerRow.klass)}
                    >
                      {classNameOf(playerRow.klass)}
                    </span>
                  </td>
                  <td className={stickyCell}>
                    {playerRow.hpPct >= 0
                      ? `${Math.round(playerRow.hpPct)}%`
                      : '–'}
                  </td>
                  <td className={stickyCell}>–</td>
                </tr>
              );
            })()}
            {/*
              Spacer rows fill the area above/below the visible slice so
              the scroll container's intrinsic height matches what the
              full unvirtualized list would be — keeps the scrollbar
              honest and Page-Up/Down behaving correctly.
            */}
            {padTop > 0 && (
              <tr style={{ height: padTop }}>
                <td colSpan={columns.length} />
              </tr>
            )}
            {virtualItems.map((vi) => {
              const r = sortedRows[vi.index];
              const isSelected = r.original.id === selectedId;
              const filterTint = rowTints
                ? tintForFilterFlags(r.original.filterFlags)
                : '';
              return (
                <tr
                  key={r.id}
                  onClick={() => onSelect(r.original.id)}
                  style={{ height: ROW_HEIGHT }}
                  className={
                    'cursor-pointer border-b border-border ' +
                    // Locked/unattackable mobs (TLP) render dimmed, mirroring
                    // the in-game greyed name.
                    (r.original.locked ? 'opacity-50 ' : '') +
                    (isSelected
                      ? 'bg-primary/20 hover:bg-primary/30'
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
            {padBot > 0 && (
              <tr style={{ height: padBot }}>
                <td colSpan={columns.length} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
