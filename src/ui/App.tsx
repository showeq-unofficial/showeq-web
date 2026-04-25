import { useCallback, useEffect, useMemo, useState } from 'react';
import { SeqClient } from '../net/client';
import { SpawnStore } from '../state/store';
import { BuffsPanel } from './BuffsPanel';
import { ChatLog } from './ChatLog';
import { CombatLog } from './CombatLog';
import { GroupPanel } from './GroupPanel';
import { MapCanvas } from './MapCanvas';
import { Panel } from './Panel';
import { ResizeHandle } from './ResizeHandle';
import { SpawnList } from './SpawnList';
import { StatsPanel } from './StatsPanel';

type ConnStatus = 'disconnected' | 'connecting' | 'open';

const DEFAULT_URL = `ws://${window.location.hostname || 'localhost'}:9090`;
const URL_STORAGE_KEY = 'showeq.daemonUrl';
const PANEL_STORAGE_KEY = 'showeq.panels';
const RAIL_WIDTH_STORAGE_KEY = 'showeq.railWidths';

// Pixel constraints on rail widths. Center map gets the rest, with its
// own min-w-[300px] so rails can't crush it down to a sliver.
const RAIL_MIN = 200;
const RAIL_MAX = 600;
const DEFAULT_LEFT_WIDTH = 320;
const DEFAULT_RIGHT_WIDTH = 320;

type RailWidths = { left: number; right: number };

function loadRailWidths(): RailWidths {
  try {
    const raw = localStorage.getItem(RAIL_WIDTH_STORAGE_KEY);
    if (!raw) return { left: DEFAULT_LEFT_WIDTH, right: DEFAULT_RIGHT_WIDTH };
    const parsed = JSON.parse(raw) as Partial<RailWidths>;
    return {
      left:  clampRail(parsed.left  ?? DEFAULT_LEFT_WIDTH),
      right: clampRail(parsed.right ?? DEFAULT_RIGHT_WIDTH),
    };
  } catch {
    return { left: DEFAULT_LEFT_WIDTH, right: DEFAULT_RIGHT_WIDTH };
  }
}

function clampRail(w: number): number {
  return Math.max(RAIL_MIN, Math.min(RAIL_MAX, w));
}

const STATUS_BADGE: Record<ConnStatus, string> = {
  open:         'bg-emerald-700 text-emerald-100',
  connecting:   'bg-amber-700 text-amber-100',
  disconnected: 'bg-red-800 text-red-100',
};

type PanelKey = 'spawns' | 'stats' | 'buffs' | 'group' | 'chat' | 'combat';
const PANEL_DEFS: { key: PanelKey; label: string }[] = [
  { key: 'spawns', label: 'Spawns' },
  { key: 'stats',  label: 'Stats'  },
  { key: 'buffs',  label: 'Buffs'  },
  { key: 'group',  label: 'Group'  },
  { key: 'chat',   label: 'Chat'   },
  { key: 'combat', label: 'Combat' },
];
const DEFAULT_VISIBILITY: Record<PanelKey, boolean> = {
  spawns: true,
  stats:  true,
  buffs:  false,
  group:  true,
  chat:   true,
  combat: false,
};

function loadVisibility(): Record<PanelKey, boolean> {
  try {
    const raw = localStorage.getItem(PANEL_STORAGE_KEY);
    if (!raw) return DEFAULT_VISIBILITY;
    const parsed = JSON.parse(raw) as Partial<Record<PanelKey, boolean>>;
    return { ...DEFAULT_VISIBILITY, ...parsed };
  } catch {
    return DEFAULT_VISIBILITY;
  }
}

export function App() {
  const store = useMemo(() => new SpawnStore(), []);
  const [status, setStatus] = useState<ConnStatus>('disconnected');
  const [url, setUrl] = useState(() => localStorage.getItem(URL_STORAGE_KEY) || DEFAULT_URL);
  const [urlDraft, setUrlDraft] = useState(url);
  // Coarse tick so panels re-render even though the store mutates in
  // place. MapCanvas drives its own rAF loop independently.
  const [tick, setTick] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectVersion, setSelectVersion] = useState(0);
  const [visibility, setVisibility] = useState<Record<PanelKey, boolean>>(() => loadVisibility());
  const [railWidths, setRailWidths] = useState<RailWidths>(() => loadRailWidths());

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    localStorage.setItem(PANEL_STORAGE_KEY, JSON.stringify(visibility));
  }, [visibility]);

  useEffect(() => {
    localStorage.setItem(RAIL_WIDTH_STORAGE_KEY, JSON.stringify(railWidths));
  }, [railWidths]);

  const onLeftResize = useCallback((dx: number) => {
    setRailWidths((w) => ({ ...w, left: clampRail(w.left + dx) }));
  }, []);
  const onRightResize = useCallback((dx: number) => {
    // Right rail grows when you drag the handle leftward.
    setRailWidths((w) => ({ ...w, right: clampRail(w.right - dx) }));
  }, []);

  const togglePanel = (key: PanelKey) =>
    setVisibility((v) => ({ ...v, [key]: !v[key] }));
  const hidePanel = (key: PanelKey) =>
    setVisibility((v) => ({ ...v, [key]: false }));

  const onSelect = (id: number | null) => {
    setSelectedId(id);
    setSelectVersion((v) => v + 1);
  };

  const commitUrl = () => {
    const trimmed = urlDraft.trim();
    if (!trimmed || trimmed === url) { setUrlDraft(url); return; }
    localStorage.setItem(URL_STORAGE_KEY, trimmed);
    setUrl(trimmed);
  };

  useEffect(() => {
    setStatus('connecting');
    const client = new SeqClient(url);
    const detachEnv = client.onEnvelope((env) => store.apply(env));
    const ws = { detach: () => { client.close(); detachEnv(); } };

    const poll = setInterval(() => {
      const w = (client as unknown as { ws?: WebSocket }).ws;
      if (!w) return;
      switch (w.readyState) {
        case WebSocket.CONNECTING: setStatus('connecting'); break;
        case WebSocket.OPEN:       setStatus('open');       break;
        default:                   setStatus('disconnected');
      }
    }, 500);

    client.connect();
    return () => { clearInterval(poll); ws.detach(); };
  }, [store, url]);

  const showLeftRail = visibility.spawns;
  const showRightRail =
    visibility.stats || visibility.buffs || visibility.group ||
    visibility.chat  || visibility.combat;

  return (
    <main className="flex h-screen w-screen flex-col bg-bg-base text-neutral-200">
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-neutral-800 bg-bg-panel px-3 py-2">
        <h1 className="m-0 text-base font-semibold">ShowEQ</h1>
        <input
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onBlur={commitUrl}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.currentTarget.blur(); }
            else if (e.key === 'Escape') { setUrlDraft(url); e.currentTarget.blur(); }
          }}
          spellCheck={false}
          className="w-80 rounded border border-neutral-700 bg-bg-base px-2 py-1 font-mono text-xs text-neutral-200 focus:border-blue-500 focus:outline-none"
        />
        <span className={`rounded px-2 py-0.5 text-xs ${STATUS_BADGE[status]}`}>
          {status}
        </span>
        <div className="ml-auto flex gap-1">
          {PANEL_DEFS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => togglePanel(p.key)}
              aria-pressed={visibility[p.key]}
              className={
                'rounded px-2 py-0.5 text-xs transition-colors ' +
                (visibility[p.key]
                  ? 'bg-blue-700 text-white hover:bg-blue-600'
                  : 'border border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200')
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        {showLeftRail && (
          <>
            <div
              className="flex shrink-0 flex-col"
              style={{ width: `${railWidths.left}px` }}
            >
              {visibility.spawns && (
                <Panel
                  title="Spawns"
                  onClose={() => hidePanel('spawns')}
                  className="min-h-0 flex-1"
                >
                  <SpawnList
                    store={store}
                    tick={tick}
                    selectedId={selectedId}
                    onSelect={onSelect}
                  />
                </Panel>
              )}
            </div>
            <ResizeHandle onDrag={onLeftResize} />
          </>
        )}
        <div className="min-w-[300px] flex-1">
          <MapCanvas
            store={store}
            tick={tick}
            selectedId={selectedId}
            selectVersion={selectVersion}
          />
        </div>
        {showRightRail && (
          <>
            <ResizeHandle onDrag={onRightResize} />
            <div
              className="flex shrink-0 flex-col"
              style={{ width: `${railWidths.right}px` }}
            >
              {visibility.stats && (
                <Panel title="Stats" onClose={() => hidePanel('stats')}>
                  <StatsPanel store={store} tick={tick} />
                </Panel>
              )}
              {visibility.buffs && (
                <Panel title="Buffs" onClose={() => hidePanel('buffs')}>
                  <BuffsPanel store={store} tick={tick} />
                </Panel>
              )}
              {visibility.group && (
                <Panel title="Group" onClose={() => hidePanel('group')}>
                  <GroupPanel store={store} tick={tick} />
                </Panel>
              )}
              {visibility.combat && (
                <Panel
                  title="Combat"
                  onClose={() => hidePanel('combat')}
                  className="min-h-0 flex-1"
                >
                  <CombatLog store={store} tick={tick} />
                </Panel>
              )}
              {visibility.chat && (
                <Panel
                  title="Chat"
                  onClose={() => hidePanel('chat')}
                  className="min-h-0 flex-1"
                >
                  <ChatLog store={store} tick={tick} />
                </Panel>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
