import { useEffect, useRef, useState } from 'react';
import type { SpawnStore } from '../state/store';

// MessageType ids from showeq-daemon/src/message.h. The daemon only
// forwards player-to-player chat for Phase 3 (so e.g. MT_System and
// formatted/special server messages won't appear), but we keep the full
// label table so future expansion just shows up correctly.
const CHANNEL_NAMES: Record<number, string> = {
  0:  'Guild',
  2:  'Group',
  3:  'Shout',
  4:  'Auction',
  5:  'OOC',
  7:  'Tell',
  8:  'Say',
  11: 'GM',
  14: 'GM',
  15: 'Raid',
};

const CHANNEL_COLORS: Record<number, string> = {
  0:  'text-cyan-700 dark:text-cyan-300',     // Guild
  2:  'text-cyan-700 dark:text-cyan-400',     // Group
  3:  'text-yellow-700 dark:text-yellow-300',   // Shout
  4:  'text-amber-600 dark:text-amber-400',    // Auction
  5:  'text-emerald-600 dark:text-emerald-300',  // OOC
  7:  'text-pink-600 dark:text-pink-300',     // Tell
  8:  'text-foreground',  // Say
  11: 'text-fuchsia-600 dark:text-fuchsia-300',  // GMSay
  14: 'text-fuchsia-600 dark:text-fuchsia-400',  // GMTell
  15: 'text-rose-600 dark:text-rose-300',     // Raid
};

function channelLabel(ch: number): string {
  return CHANNEL_NAMES[ch] ?? `#${ch}`;
}

function channelColor(ch: number): string {
  return CHANNEL_COLORS[ch] ?? 'text-foreground';
}

export function ChatLog({ store, tick }: { store: SpawnStore; tick: number }) {
  void tick; // re-renders on each tick when new messages have arrived
  const log = store.chatLog();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  // Track the user's intent to stay pinned to the bottom: if they scroll
  // up to read backlog, new messages don't yank them back.
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
        Waiting for chat…
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="flex h-full min-h-0 flex-col overflow-y-auto px-2 py-1 font-mono text-[11px] leading-snug"
    >
      {log.map((m) => (
        <div key={m.seq.toString()} className="break-words">
          <span className={channelColor(m.channel)}>
            [{channelLabel(m.channel)}]
          </span>{' '}
          <span className="text-foreground">{m.from}</span>
          {m.target && (
            <>
              <span className="text-muted-foreground"> → </span>
              <span className="text-foreground">{m.target}</span>
            </>
          )}
          <span className="text-muted-foreground">:</span>{' '}
          <span className="text-foreground">{m.text}</span>
        </div>
      ))}
    </div>
  );
}
