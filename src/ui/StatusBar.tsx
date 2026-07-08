import type { SeqClient } from '@/net/client';
import type { SpawnStore } from '@/state/store';
import { formatLoc } from '@/lib/coords';

// Norrath month names — EQ uses 12 months. Abbreviated since the bar
// has finite horizontal real estate.
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

function formatXpRate(rate: { pctPerHour: number; msToLevel: number | null }): string {
  if (rate.msToLevel === null) {
    return `${rate.pctPerHour.toFixed(1)}%/hr`;
  }
  const hours = rate.msToLevel / 3600000;
  if (hours < 1) {
    const mins = Math.round(rate.msToLevel / 60000);
    return `${rate.pctPerHour.toFixed(1)}%/hr · ${mins}m to ding`;
  }
  return `${rate.pctPerHour.toFixed(1)}%/hr · ${hours.toFixed(1)}h to ding`;
}

// `tick` is the App's 1Hz re-render driver; we don't read it, but
// declaring the prop keeps StatusBar in the same render-key shape as
// the other store-reading panels.
export function StatusBar({
  store,
  client,
  tick,
}: {
  store: SpawnStore;
  client: SeqClient | null;
  tick: number;
}) {
  void tick;

  const zs = store.zoneServerInfo();
  const eq = store.eqTime();
  const player = store.player();
  const zoneLong = store.zoneLongName();
  const zoneShort = store.zone();
  const xpRate = store.expRate();
  const connState = client?.state() ?? 'closed';

  // Connection dot color + label. We don't bother distinguishing
  // 'closing' from 'closed' — the reconnect loop is going to retry
  // anyway, so both surface to the user as "not connected".
  const connDot = connState === 'open'       ? 'bg-emerald-500'
                : connState === 'connecting' ? 'bg-amber-500 animate-pulse'
                                             : 'bg-rose-500';
  const connLabel = connState === 'open'       ? 'connected'
                  : connState === 'connecting' ? 'connecting…'
                                               : 'offline';

  let timeText = '—';
  if (eq) {
    const elapsedIrlMs = Number(BigInt(Date.now()) - eq.serverMs);
    const elapsedEqMin = Math.floor((elapsedIrlMs * EQ_TIME_SCALE) / 60000);
    const total = eq.sync.minute + elapsedEqMin;
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
  const zoneText = zoneLong || zoneShort || '—';
  const locText = player?.pos
    ? formatLoc(player.pos.x, player.pos.y, player.pos.z)
    : '—';
  const xpText = xpRate ? formatXpRate(xpRate) : '—';

  // Items rendered as cells. Tailwind `min-w-0` lets the truncate work
  // inside the flex parent. Order: connection (compact, leftmost) →
  // server → zone → /loc → xp/hr → eq time (rightmost). Server + time
  // anchor the ends of the original justify-between layout; the new
  // cells stack between them.
  return (
    <div className="flex shrink-0 flex-col">
      <div aria-hidden className="h-1 shrink-0 bg-border" />
      <div className="flex h-5 shrink-0 items-stretch gap-3 bg-bg-alt px-2 text-[11px] text-muted-foreground">
        <span className="flex shrink-0 items-center gap-1.5" title={`Daemon: ${connLabel}`}>
          <span className={`h-2 w-2 rounded-full ${connDot}`} aria-hidden />
          <span>{connLabel}</span>
        </span>
        <Sep />
        <span className="flex min-w-0 items-center truncate" title={`Zone server: ${serverText}`}>
          <span className="text-foreground/60">server:</span>
          <span className="ml-1 font-mono">{serverText}</span>
        </span>
        <Sep />
        <span className="flex min-w-0 items-center truncate" title={`Zone: ${zoneText}`}>
          <span className="text-foreground/60">zone:</span>
          <span className="ml-1">{zoneText}</span>
        </span>
        <Sep />
        <span className="flex min-w-0 items-center truncate" title="Player /loc — in-game (Y, X, Z) order">
          <span className="text-foreground/60">/loc:</span>
          <span className="ml-1 font-mono">{locText}</span>
        </span>
        <Sep />
        <span className="flex min-w-0 items-center truncate" title={`XP rate: ${xpText}`}>
          <span className="text-foreground/60">xp:</span>
          <span className="ml-1 font-mono">{xpText}</span>
        </span>
        <Sep className="ml-auto" />
        <span className="flex min-w-0 shrink-0 items-center truncate" title={`EQ time: ${timeText}`}>
          <span className="text-foreground/60">eq time:</span>
          <span className="ml-1 font-mono">{timeText}</span>
        </span>
      </div>
    </div>
  );
}

// Inert vertical separator. bg-border (#262626) was too close in
// luminance to bg-bg-alt (#182230) to read against the bar's
// background — the rail above only registers because it sits between
// two different-color regions. A light translucent tick (foreground at
// 15% alpha) reads as a subtle divider without competing with the
// content text.
function Sep({ className = '' }: { className?: string }) {
  return <span aria-hidden className={`my-1 w-px shrink-0 bg-foreground/15 ${className}`} />;
}
