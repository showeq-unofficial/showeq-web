import { useState } from 'react';
import type { ExpTick, SpawnStore } from '../state/store';

function fmtPct(x: number): string {
  return (x / 1000).toFixed(3) + '%';
}

function fmtMs(ms: number): string {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function SummaryBar({
  entries,
  store,
}: {
  entries: ReadonlyArray<ExpTick>;
  store: SpawnStore;
}) {
  const kills = entries.length;
  let totalXp = 0;
  for (const e of entries) totalXp += e.xpGained;
  const avgXp = kills > 0 ? totalXp / kills : 0;
  const rate = store.expRate();
  const stats = store.stats();

  return (
    <div className="shrink-0 border-b border-border px-2 py-1 text-[11px] text-muted-foreground flex flex-wrap gap-x-2">
      <span>Kills: <strong className="text-foreground">{kills}</strong></span>
      <span>Total: <strong className="text-foreground">{fmtPct(totalXp)}</strong></span>
      <span>Avg: <strong className="text-foreground">{fmtPct(avgXp)}</strong>/kill</span>
      {rate && (
        <span>Rate: <strong className="text-foreground">{rate.pctPerHour.toFixed(1)}%</strong>/hr</span>
      )}
      {rate?.msToLevel != null && (
        <span>TTL: <strong className="text-foreground">{fmtMs(rate.msToLevel)}</strong></span>
      )}
      {stats && stats.expMax > 0 && (
        <span>Rem: <strong className="text-foreground">{fmtPct(stats.expMax - stats.expCur)}</strong></span>
      )}
    </div>
  );
}

export function ExpLogPanel({ store, tick }: { store: SpawnStore; tick: number }) {
  void tick;
  const entries = store.expLogEntries();
  const [cleared, setCleared] = useState(false);
  void cleared;

  if (entries.length === 0) {
    return (
      <div className="px-2 py-2 text-xs text-muted-foreground">
        Waiting for experience…
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <SummaryBar entries={entries} store={store} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <table className="w-full text-[11px] font-mono">
          <thead className="sticky top-0 bg-bg-panel">
            <tr className="text-left text-muted-foreground">
              <th className="px-1 py-0.5 font-normal">Time</th>
              <th className="px-1 py-0.5 font-normal">Mob</th>
              <th className="px-1 py-0.5 font-normal text-right">Lvl</th>
              <th className="px-1 py-0.5 font-normal text-right">XP</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: entries.length }, (_, i) => entries[entries.length - 1 - i]).map(
              (e, i) => (
                <tr key={entries.length - 1 - i} className="border-t border-border/30">
                  <td className="px-1 py-px text-muted-foreground whitespace-nowrap">
                    {fmtTime(e.localTs)}
                  </td>
                  <td className="max-w-[120px] truncate px-1 py-px">
                    {e.mobName
                      ? e.mobName.replace(/[0-9]/g, '').replace(/_/g, ' ')
                      : <span className="text-muted-foreground italic">(group kill)</span>}
                  </td>
                  <td className="px-1 py-px text-right">
                    {e.mobLevel > 0 ? e.mobLevel : '?'}
                  </td>
                  <td className="px-1 py-px text-right text-emerald-600 dark:text-emerald-300">
                    {fmtPct(e.xpGained)}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      <div className="shrink-0 border-t border-border px-2 py-1">
        <button
          onClick={() => { store.clearExpLog(); setCleared((v) => !v); }}
          className="text-[11px] text-muted-foreground hover:text-foreground"
        >
          Clear log
        </button>
      </div>
    </div>
  );
}
