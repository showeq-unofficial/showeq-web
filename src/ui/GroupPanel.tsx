import type { SpawnStore } from '../state/store';
import { classNameOf } from './classes';

const SLOT_COUNT = 6;

function fmt(n: number, width = 4): string {
  return n.toFixed(0).padStart(width, ' ');
}

function hpPct(cur: number, max: number): number {
  if (!max) return -1;
  return Math.max(0, Math.min(100, (cur / max) * 100));
}

function distance(
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
): number {
  const dx = ax - bx, dy = ay - by, dz = az - bz;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function GroupPanel({ store, tick }: { store: SpawnStore; tick: number }) {
  void tick;
  const group = store.groupState();
  const player = store.player();

  type EmptySlot = { slot: number; empty: true };
  type FilledSlot = {
    slot: number;
    empty: false;
    name: string;
    level: number;
    class_: number;
    inZone: boolean;
    hpPct: number;
    distance: number;
  };
  const slots: Array<EmptySlot | FilledSlot> = Array.from({ length: SLOT_COUNT }, (_, i) => {
    const member = group?.members.find((m) => m.slot === i);
    if (!member || !member.name) {
      return { slot: i, empty: true } as EmptySlot;
    }
    const spawn = member.inZone
      ? store.all().find((s) => s.id === member.spawnId)
      : undefined;
    const hp = spawn ? hpPct(spawn.hpCur, spawn.hpMax) : -1;
    const d =
      spawn && spawn.pos && player?.pos
        ? distance(
            spawn.pos.x, spawn.pos.y, spawn.pos.z,
            player.pos.x, player.pos.y, player.pos.z,
          )
        : -1;
    return {
      slot: i,
      empty: false,
      name: member.name,
      level: member.level,
      class_: member.class,
      inZone: member.inZone,
      hpPct: hp,
      distance: d,
    } as FilledSlot;
  });

  return (
    <div className="flex flex-col py-1 text-xs">
      {slots.map((s) => (
        <div
          key={s.slot}
          className="flex items-center gap-2 border-b border-border px-2 py-0.5 last:border-b-0"
        >
          <span className="w-3 shrink-0 text-[10px] text-muted-foreground">
            {s.slot + 1}
          </span>
          {s.empty ? (
            <span className="flex-1 italic text-muted-foreground/60">empty</span>
          ) : (
            <>
              <span
                className={
                  'flex-1 truncate ' +
                  (s.inZone ? 'text-foreground' : 'text-muted-foreground')
                }
                title={s.name}
              >
                {s.name}
              </span>
              <span className="w-12 shrink-0 truncate text-right text-[10px] text-muted-foreground">
                {s.level || '—'} {classNameOf(s.class_ ?? 0).slice(0, 3)}
              </span>
              <span
                className={
                  'w-9 shrink-0 text-right font-mono text-[10px] ' +
                  (s.hpPct < 0
                    ? 'text-muted-foreground/60'
                    : s.hpPct < 25
                    ? 'text-red-600 dark:text-red-400'
                    : s.hpPct < 60
                    ? 'text-amber-600 dark:text-amber-300'
                    : 'text-emerald-600 dark:text-emerald-300')
                }
              >
                {s.hpPct < 0 ? '—' : `${Math.round(s.hpPct)}%`}
              </span>
              <span className="w-12 shrink-0 text-right font-mono text-[10px] text-muted-foreground">
                {s.distance < 0 ? '—' : fmt(s.distance, 4)}
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
