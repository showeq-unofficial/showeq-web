import { useMemo } from 'react';
import {
  CHAT_COLOR_ENTRIES,
  clearAllChatColorOverrides,
  clearChatColorOverride,
  setChatColorOverride,
  useChatColorOverrides,
  type ChatColorCategory,
  type ChatColorEntry,
} from '../lib/chatColors';

const CATEGORY_ORDER: ChatColorCategory[] = [
  'Channel fallback',
  'Player chat',
  'Custom channels',
  'Combat',
  'Spells',
  'System',
];

const CATEGORY_BLURB: Record<ChatColorCategory, string> = {
  'Channel fallback':
    'Used when the daemon couldn\'t infer an EQ ChatColor (player-typed chat via OP_ChannelMessage).',
  'Player chat':
    'Server-coloured player-to-player chat (raw EQ ChatColor). Echo variants are the lines you see when you\'re the sender.',
  'Custom channels':
    'Numbered chat channels you\'ve joined (/1 .. /10) plus the generic Chat Channel colour.',
  'Combat':       'Hits, misses, crits, NPC rampage/furry/enrage, damage shield.',
  'Spells':       'Casting, fizzles, wear-offs, crits, third-party spell text.',
  'System':       'Death, loot, money, who, merchant, item links, pet text, generic system text.',
};

export function ChatColorsPanel() {
  const overrides = useChatColorOverrides();

  const grouped = useMemo(() => {
    const m = new Map<ChatColorCategory, ChatColorEntry[]>();
    for (const e of CHAT_COLOR_ENTRIES) {
      const arr = m.get(e.category) ?? [];
      arr.push(e);
      m.set(e.category, arr);
    }
    return m;
  }, []);

  const overrideCount = Object.keys(overrides).length;

  return (
    <div className="flex flex-col gap-4 px-4 py-4 text-xs">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Chat colours
          </h3>
          <p className="mt-0.5 text-muted-foreground">
            Per-category overrides for the chat log. Stored in this browser
            ({overrideCount > 0
              ? `${overrideCount} customised`
              : 'all defaults'}).
          </p>
        </div>
        <button
          type="button"
          onClick={clearAllChatColorOverrides}
          disabled={overrideCount === 0}
          className="rounded border border-border bg-bg-alt px-2 py-1 text-[10px] text-foreground hover:bg-bg-base disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset all
        </button>
      </header>

      {CATEGORY_ORDER.map((cat) => {
        const entries = grouped.get(cat);
        if (!entries || entries.length === 0) return null;
        return (
          <section key={cat} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-3">
              <h4 className="text-[11px] font-semibold text-foreground">
                {cat}
              </h4>
              <p className="text-[10px] text-muted-foreground">
                {CATEGORY_BLURB[cat]}
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {entries.map((e) => (
                <ColorRow
                  key={e.key}
                  entry={e}
                  override={overrides[e.key]}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function ColorRow({
  entry,
  override,
}: {
  entry: ChatColorEntry;
  override: string | undefined;
}) {
  const current = override ?? entry.default;
  const isOverridden = override !== undefined;

  return (
    <li className="flex items-center gap-2 rounded border border-border bg-bg-base px-2 py-1">
      <input
        type="color"
        value={current}
        onChange={(ev) => setChatColorOverride(entry.key, ev.target.value)}
        aria-label={`Pick colour for ${entry.label}`}
        className="h-5 w-7 cursor-pointer rounded border border-border bg-transparent p-0"
      />
      <span
        className="font-mono text-[11px]"
        style={{ color: current }}
      >
        [{entry.label}]
      </span>
      <span className="ml-auto font-mono text-[10px] text-muted-foreground">
        {current.toUpperCase()}
      </span>
      <button
        type="button"
        onClick={() => clearChatColorOverride(entry.key)}
        disabled={!isOverridden}
        title={isOverridden ? 'Reset to default' : 'Default'}
        className="rounded border border-border bg-bg-alt px-1.5 py-0.5 text-[10px] text-foreground hover:bg-bg-panel disabled:cursor-not-allowed disabled:opacity-40"
      >
        ↺
      </button>
    </li>
  );
}
