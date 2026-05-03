import { useEffect, useMemo, useRef, useState } from 'react';
import type { SpawnStore } from '../state/store';
import {
  isCombatChatColor,
  resolveChatStyle,
  useChatColorOverrides,
} from '../lib/chatColors';

export function ChatLog({ store, tick }: { store: SpawnStore; tick: number }) {
  void tick; // re-renders on each tick when new messages have arrived
  const fullLog = store.chatLog();
  // Combat-flavored lines (resists, fizzles, pet spell hits, etc.) are
  // surfaced by CombatLog instead — keep them out of Chat to avoid the
  // double-render. The proper home for this routing is the daemon; see
  // CombatLog.tsx for the intended migration.
  const log = useMemo(
    () => fullLog.filter((m) => !isCombatChatColor(m.chatColor)),
    [fullLog],
  );
  const overrides = useChatColorOverrides();
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
      {log.map((m) => {
        const { label, color } = resolveChatStyle(m.channel, m.chatColor, overrides);
        return (
          <div key={m.seq.toString()} className="break-words">
            <span style={{ color }}>[{label}]</span>{' '}
            <span className="text-foreground">{m.from}</span>
            {m.target && (
              <>
                <span className="text-muted-foreground"> → </span>
                <span className="text-foreground">{m.target}</span>
              </>
            )}
            <span className="text-muted-foreground">:</span>{' '}
            <span style={{ color }}>{m.text}</span>
          </div>
        );
      })}
    </div>
  );
}
