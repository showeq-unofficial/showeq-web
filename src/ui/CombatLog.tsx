import { useEffect, useRef, useState } from 'react';
import type { SpawnStore } from '../state/store';

// EQ "action" type byte. The concrete IDs are documented loosely in
// showeq-c. Most flow through as damage events; cast/falls/etc are
// metadata-only and don't carry damage. We render any non-zero damage
// as "<source> <type> <target>".
const TYPE_NAMES: Record<number, string> = {
  0:  'hits',
  1:  'bashes',
  2:  'slashes',
  3:  'kicks',
  4:  'pierces',
  5:  'crushes',
  10: 'casts on',
  28: 'fires on',
};

function typeLabel(t: number): string {
  return TYPE_NAMES[t] ?? `(type ${t})`;
}

export function CombatLog({ store, tick }: { store: SpawnStore; tick: number }) {
  void tick;
  const log = store.combatLog();
  const player = store.player();
  const playerId = player?.id ?? 0;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [stickToBottom, setStickToBottom] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !stickToBottom) return;
    el.scrollTop = el.scrollHeight;
  }, [log.length, stickToBottom]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
    setStickToBottom(nearBottom);
  };

  if (log.length === 0) {
    return (
      <div className="px-2 py-2 text-xs text-muted-foreground">
        Waiting for combat events…
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="flex h-full min-h-0 flex-col overflow-y-auto px-2 py-1 font-mono text-[11px] leading-snug"
    >
      {log.map((e) => {
        const isOutgoing = playerId !== 0 && e.sourceId === playerId;
        const isIncoming = playerId !== 0 && e.targetId === playerId;
        const damageColor = isOutgoing
          ? 'text-emerald-600 dark:text-emerald-300'
          : isIncoming
          ? 'text-red-600 dark:text-red-300'
          : 'text-foreground';
        const source = e.sourceName || `#${e.sourceId}`;
        const target = e.targetName || `#${e.targetId}`;
        return (
          <div key={e.seq.toString()} className="break-words">
            <span className={isOutgoing ? 'text-emerald-700 dark:text-emerald-200' : 'text-foreground'}>
              {source}
            </span>{' '}
            <span className="text-muted-foreground">{typeLabel(e.type)}</span>{' '}
            <span className={isIncoming ? 'text-red-700 dark:text-red-200' : 'text-foreground'}>
              {target}
            </span>
            {e.damage !== 0 && (
              <>
                {' '}
                <span className="text-muted-foreground">for</span>{' '}
                <span className={damageColor}>{e.damage}</span>
              </>
            )}
            {e.spellName && (
              <span className="text-muted-foreground"> ({e.spellName})</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
