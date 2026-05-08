import type { SpawnStore } from '@/state/store';

// Norrath month names — EQ uses 12 months, lifted from
// showeq-c/src/datetimemgr-friendly conventions. The official EQ
// calendar names are too long for a status bar; abbreviate.
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// 1 IRL second = 20 EQ seconds. Sync arrives infrequently (zone-in);
// the bar extrapolates locally between syncs.
const EQ_TIME_SCALE = 20;

function formatEqTime(year: number, month: number, day: number, hour: number, minute: number): string {
  const m = MONTHS[(month - 1) % 12] ?? '???';
  const ampm = hour >= 12 ? 'pm' : 'am';
  const hr12 = ((hour + 11) % 12) + 1;
  const mm = minute.toString().padStart(2, '0');
  return `${m} ${day}, ${year} — ${hr12}:${mm}${ampm}`;
}

// `tick` is the App's 1Hz re-render driver; we don't read it, but
// declaring the prop keeps StatusBar in the same render-key shape as
// the other store-reading panels.
export function StatusBar({ store, tick }: { store: SpawnStore; tick: number }) {
  void tick;

  const zs = store.zoneServerInfo();
  const eq = store.eqTime();

  let timeText = '—';
  if (eq) {
    // Extrapolate from sync point. server_ts_ms is the daemon's
    // wallclock when OP_TimeOfDay was parsed; current local wallclock
    // minus that gives elapsed IRL ms, * 20 / 1000 = elapsed EQ
    // seconds. Add to the synced minute to get current EQ minute (we
    // discard sub-minute precision — the daemon ships only minute
    // resolution and a 60-sec rolling display is accurate enough).
    const elapsedIrlMs = Number(BigInt(Date.now()) - eq.serverMs);
    const elapsedEqMin = Math.floor((elapsedIrlMs * EQ_TIME_SCALE) / 60000);
    let total = eq.sync.minute + elapsedEqMin;
    let hour = eq.sync.hour + Math.floor(total / 60);
    const minute = ((total % 60) + 60) % 60;
    let day = eq.sync.day + Math.floor(hour / 24);
    hour = ((hour % 24) + 24) % 24;
    let month = eq.sync.month;
    let year = eq.sync.year;
    // EQ months are flat 28 days. Roll over month/year on overflow.
    while (day > 28) { day -= 28; month++; }
    while (month > 12) { month -= 12; year++; }
    timeText = formatEqTime(year, month, day, hour, minute);
  }

  const serverText = zs && zs.host ? `${zs.host}:${zs.port}` : '—';

  return (
    <div className="flex h-5 shrink-0 items-center justify-between gap-4 border-t border-border bg-bg-alt px-2 text-[11px] text-muted-foreground">
      <span className="truncate" title={`Zone server: ${serverText}`}>
        <span className="text-foreground/60">zone server:</span>{' '}
        <span className="font-mono">{serverText}</span>
      </span>
      <span className="truncate" title={`EQ time: ${timeText}`}>
        <span className="text-foreground/60">eq time:</span>{' '}
        <span className="font-mono">{timeText}</span>
      </span>
    </div>
  );
}
