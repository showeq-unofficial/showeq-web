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

function distance(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx, dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
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
        ? distance(spawn.pos.x, spawn.pos.y, player.pos.x, player.pos.y)
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
          className="flex items-center gap-2 border-b border-neutral-900 px-2 py-0.5 last:border-b-0"
        >
          <span className="w-3 shrink-0 text-[10px] text-neutral-500">
            {s.slot + 1}
          </span>
          {s.empty ? (
            <span className="flex-1 italic text-neutral-600">empty</span>
          ) : (
            <>
              <span
                className={
                  'flex-1 truncate ' +
                  (s.inZone ? 'text-neutral-200' : 'text-neutral-500')
                }
                title={s.name}
              >
                {s.name}
              </span>
              <span className="w-12 shrink-0 truncate text-right text-[10px] text-neutral-500">
                {s.level || '—'} {classNameOf(s.class_ ?? 0).slice(0, 3)}
              </span>
              <span
                className={
                  'w-9 shrink-0 text-right font-mono text-[10px] ' +
                  (s.hpPct < 0
                    ? 'text-neutral-600'
                    : s.hpPct < 25
                    ? 'text-red-400'
                    : s.hpPct < 60
                    ? 'text-amber-300'
                    : 'text-emerald-300')
                }
              >
                {s.hpPct < 0 ? '—' : `${Math.round(s.hpPct)}%`}
              </span>
              <span className="w-12 shrink-0 text-right font-mono text-[10px] text-neutral-400">
                {s.distance < 0 ? '—' : fmt(s.distance, 4)}
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
