import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel,
  useReactTable, type SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { fetchLoot, formatCoin, lootApiBase, type LootRecord } from '@/lib/lootApi';

const ROW_HEIGHT = 24;
const POLL_MS = 10_000;
const FETCH_LIMIT = 5000;

const fmtTime = (ts: number) => {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const col = createColumnHelper<LootRecord>();
const columns = [
  col.accessor('ts', { header: 'Time', size: 96, cell: (i) => fmtTime(i.getValue()) }),
  col.accessor('item_name', { header: 'Item', size: 220 }),
  col.accessor('item_id', {
    header: 'ID', size: 64,
    cell: (i) => <span className="text-muted-foreground">{i.getValue() ?? ''}</span>,
  }),
  col.accessor('qty', {
    header: 'Qty', size: 44,
    cell: (i) => <span className="tabular-nums">{i.getValue() > 1 ? i.getValue() : ''}</span>,
  }),
  col.accessor('mob_name', { header: 'Mob', size: 160, cell: (i) => i.getValue() ?? '' }),
  col.accessor('zone_base', {
    header: 'Zone', size: 150,
    cell: (i) => {
      const r = i.row.original;
      return (
        <span>
          {r.zone_base}
          {r.instance ? <span className="ml-1 text-muted-foreground">·{r.instance}</span> : null}
        </span>
      );
    },
  }),
  col.accessor('disposition', {
    header: 'Where', size: 108,
    cell: (i) => <span className="text-muted-foreground">{i.getValue() ?? ''}</span>,
  }),
  col.accessor('money_copper', {
    header: 'Coin', size: 92,
    cell: (i) => <span className="tabular-nums text-amber-500">{formatCoin(i.getValue())}</span>,
  }),
  col.accessor('source', {
    header: 'Src', size: 60,
    cell: (i) => (
      <span className="text-muted-foreground">{i.getValue() === 'message' ? 'got' : 'corpse'}</span>
    ),
  }),
];

type SourceFilter = 'all' | 'message' | 'window';

export function LootBrowser({ daemonUrl }: { daemonUrl: string }) {
  const base = useMemo(() => lootApiBase(daemonUrl), [daemonUrl]);
  const [rows, setRows] = useState<LootRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [zone, setZone] = useState('');
  const [source, setSource] = useState<SourceFilter>('all');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'ts', desc: true }]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const data = await fetchLoot(base, FETCH_LIMIT);
        if (!alive) return;
        setRows(data);
        setError(null);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (alive) setLoaded(true);
      }
    };
    load();
    const t = setInterval(load, POLL_MS);
    return () => { alive = false; clearInterval(t); };
  }, [base]);

  const zones = useMemo(
    () => Array.from(new Set(rows.map((r) => r.zone_base).filter(Boolean))).sort() as string[],
    [rows],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (source !== 'all' && r.source !== source) return false;
      if (zone && r.zone_base !== zone) return false;
      if (q && !(r.item_name.toLowerCase().includes(q) || (r.mob_name ?? '').toLowerCase().includes(q)))
        return false;
      return true;
    });
  }, [rows, search, zone, source]);

  const stats = useMemo(() => {
    const items = new Set<string>();
    const mobs = new Set<string>();
    let coin = 0;
    for (const r of filtered) {
      items.add(r.item_name);
      if (r.mob_name) mobs.add(r.mob_norm ?? r.mob_name);
      coin += r.money_copper;
    }
    return { count: filtered.length, items: items.size, mobs: mobs.size, coin };
  }, [filtered]);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getRowId: (r) => String(r.id),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const sorted = table.getRowModel().rows;

  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: sorted.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12,
  });
  const items = virtualizer.getVirtualItems();
  const padTop = items.length ? items[0].start : 0;
  const padBot = items.length ? virtualizer.getTotalSize() - items[items.length - 1].end : 0;

  const inputCls =
    'h-6 rounded border border-border bg-bg-alt px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary';

  return (
    <div className="flex h-full flex-col bg-bg-base text-xs">
      {/* controls */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
        <input
          className={`${inputCls} w-56`}
          placeholder="Search item or mob…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className={inputCls} value={zone} onChange={(e) => setZone(e.target.value)}>
          <option value="">All zones</option>
          {zones.map((z) => <option key={z} value={z}>{z}</option>)}
        </select>
        <select className={inputCls} value={source} onChange={(e) => setSource(e.target.value as SourceFilter)}>
          <option value="all">All sources</option>
          <option value="message">Acquired (got)</option>
          <option value="window">On corpse (drop table)</option>
        </select>
        {(search || zone || source !== 'all') && (
          <button
            className="h-6 rounded border border-border px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => { setSearch(''); setZone(''); setSource('all'); }}
          >
            Clear
          </button>
        )}
        <div className="ml-auto flex items-center gap-3 text-muted-foreground">
          <span><span className="text-foreground tabular-nums">{stats.count}</span> rows</span>
          <span><span className="text-foreground tabular-nums">{stats.items}</span> items</span>
          <span><span className="text-foreground tabular-nums">{stats.mobs}</span> mobs</span>
          {stats.coin > 0 && <span className="text-amber-500 tabular-nums">{formatCoin(stats.coin)}</span>}
        </div>
      </div>

      {/* body */}
      {error && rows.length === 0 ? (
        <div className="m-auto max-w-md text-center text-muted-foreground">
          <p className="mb-2 text-foreground">Can't reach the loot recorder.</p>
          <p>Tried <code className="text-foreground">{base}/api/loot</code> ({error}).</p>
          <p className="mt-2">Start it on the daemon host with <code className="text-foreground">bun run record</code>.</p>
        </div>
      ) : loaded && rows.length === 0 ? (
        <div className="m-auto max-w-md text-center text-muted-foreground">
          No loot recorded yet. Loot something while <code className="text-foreground">bun run record</code> is running.
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-auto">
          <table className="w-full table-fixed border-collapse">
            <thead className="sticky top-0 z-10 bg-bg-panel">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-border">
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      style={{ width: h.getSize() }}
                      className="cursor-pointer select-none px-2 py-1 text-left font-medium text-muted-foreground hover:text-foreground"
                      onClick={h.column.getToggleSortingHandler()}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {{ asc: ' ▲', desc: ' ▼' }[h.column.getIsSorted() as string] ?? ''}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {padTop > 0 && <tr style={{ height: padTop }} />}
              {items.map((vi) => {
                const row = sorted[vi.index];
                return (
                  <tr
                    key={row.id}
                    style={{ height: ROW_HEIGHT }}
                    className="border-b border-border/40 odd:bg-bg-alt/30 hover:bg-bg-alt"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="truncate px-2" style={{ width: cell.column.getSize() }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {padBot > 0 && <tr style={{ height: padBot }} />}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
