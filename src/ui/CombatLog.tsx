import { useEffect, useRef, useState } from 'react';
import {
  isCombatChatColor,
  resolveChatStyle,
  useChatColorOverrides,
} from '../lib/chatColors';
import type { ChatEntry, CombatEntry, SpawnStore } from '../state/store';

// `type` is the EQ skill id (the action type byte). 231 is the
// synthetic "non-melee damage" bucket spells / DoT ticks flow through.
const TYPE_NAMES: Record<number, string> = {
  0:   'crushes',     // 1H Blunt
  1:   'slashes',     // 1H Slashing
  2:   'crushes',     // 2H Blunt
  3:   'slashes',     // 2H Slashing
  7:   'shoots',      // Archery
  8:   'backstabs',   // Backstab
  10:  'bashes',      // Bash
  21:  'punches',     // Dragon Punch / Tail Rake
  23:  'strikes',     // Eagle Strike
  26:  'kicks',       // Flying Kick
  28:  'hits',        // Hand to Hand
  30:  'kicks',       // Kick
  36:  'pierces',     // 1H Piercing
  38:  'kicks',       // Round Kick
  51:  'throws',      // Throwing
  52:  'claws',       // Tiger Claw
  231: 'casts on',    // Non-Melee Damage
};

function typeLabel(t: number): string {
  return TYPE_NAMES[t] ?? `(skill ${t})`;
}

// Merge struct so combat events and combat-flavored chat lines render
// in arrival order. `seq` is the daemon's monotonic envelope sequence
// — both kinds share it, so a single sort key works.
type Row =
  | { kind: 'combat'; seq: bigint; entry: CombatEntry }
  | { kind: 'chat';   seq: bigint; entry: ChatEntry };

// XXX: this is a client-side workaround. The proper fix is for the
// daemon to parse spell-outcome chat templates (resists, fizzles, DoT
// ticks, pet spell hits, etc.) and emit them as CombatEvents — that
// would give a single authoritative event stream and let the daemon
// also drop the chat-side delivery if desired. Until then, the Combat
// panel scrapes chat lines whose ChatColor is in the Combat or Spells
// category (see lib/chatColors.ts → isCombatChatColor).
export function CombatLog({ store, tick }: { store: SpawnStore; tick: number }) {
  void tick;
  const combat = store.combatLog();
  const chat = store.chatLog();
  const overrides = useChatColorOverrides();
  const player = store.player();
  const playerId = player?.id ?? 0;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [stickToBottom, setStickToBottom] = useState(true);

  // Build the merged stream. Filter chat down to combat-flavored colors
  // first to keep the sort linear in the relevant subset rather than
  // the full chat history.
  const rows: Row[] = [];
  for (const e of combat) rows.push({ kind: 'combat', seq: e.seq, entry: e });
  for (const m of chat) {
    if (!isCombatChatColor(m.chatColor)) continue;
    rows.push({ kind: 'chat', seq: m.seq, entry: m });
  }
  rows.sort((a, b) => (a.seq < b.seq ? -1 : a.seq > b.seq ? 1 : 0));

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !stickToBottom) return;
    el.scrollTop = el.scrollHeight;
  }, [rows.length, stickToBottom]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
    setStickToBottom(nearBottom);
  };

  if (rows.length === 0) {
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
      {rows.map((r) => {
        if (r.kind === 'combat') {
          const e = r.entry;
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
            <div key={`c:${e.seq.toString()}`} className="break-words">
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
        }
        const m = r.entry;
        const { label, color } = resolveChatStyle(m.channel, m.chatColor, overrides);
        return (
          <div key={`m:${m.seq.toString()}`} className="break-words">
            <span style={{ color }}>[{label}]</span>{' '}
            <span style={{ color }}>{m.text}</span>
          </div>
        );
      })}
    </div>
  );
}
