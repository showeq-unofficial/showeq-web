import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { SeqClient } from '../net/client';
import { localPrefs } from '../state/localPrefs';
import { SpawnStore } from '../state/store';
import { BuffsPanel } from './BuffsPanel';
import { ChatLog } from './ChatLog';
import { CombatLog } from './CombatLog';
import { FilterRulesPanel } from './FilterRulesPanel';
import { GroupPanel } from './GroupPanel';
import { MapCanvas } from './MapCanvas';
import { Panel } from './Panel';
import { PreferencesPanel } from './PreferencesPanel';
import { ResizeHandle } from './ResizeHandle';
import { SettingsModal } from './SettingsModal';
import { SpawnList } from './SpawnList';
import { SpawnPointList } from './SpawnPointList';
import { StatsPanel } from './StatsPanel';
import { VerticalResizeHandle } from './VerticalResizeHandle';

type ConnStatus = 'disconnected' | 'connecting' | 'connected';

// Match the page's scheme so an https-hosted UI doesn't trip mixed-content.
// Daemon is expected to run on the user's own machine, not the page origin.
const DEFAULT_WS_SCHEME = window.location.protocol === 'https:' ? 'wss' : 'ws';
const DEFAULT_URL = `${DEFAULT_WS_SCHEME}://localhost:9090`;
const URL_STORAGE_KEY = 'showeq.daemonUrl';
const PANEL_STORAGE_KEY = 'showeq.panels';
const RAIL_WIDTH_STORAGE_KEY = 'showeq.railWidths';
// Fraction (0..1) of the left rail's height given to the Spawns panel
// when both Spawns and SpawnPoints are visible. The remainder goes to
// the SpawnPoints panel below it. Persisted so the user's split
// survives a reload.
const LEFT_SPLIT_STORAGE_KEY = 'showeq.leftSplit';
const DEFAULT_LEFT_SPLIT = 0.55;
const LEFT_SPLIT_MIN = 0.15;
const LEFT_SPLIT_MAX = 0.85;

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

function clampSplit(s: number): number {
  return Math.max(LEFT_SPLIT_MIN, Math.min(LEFT_SPLIT_MAX, s));
}

const STATUS_BADGE: Record<ConnStatus, string> = {
  connected:    'bg-emerald-700 text-emerald-100',
  connecting:   'bg-amber-700 text-amber-100',
  disconnected: 'bg-red-800 text-red-100',
};

type PanelKey =
  | 'spawns' | 'spawnPoints' | 'stats' | 'buffs' | 'group' | 'chat' | 'combat';
const PANEL_DEFS: { key: PanelKey; label: string }[] = [
  { key: 'spawns',      label: 'Spawns'  },
  { key: 'spawnPoints', label: 'Points'  },
  { key: 'stats',       label: 'Stats'   },
  { key: 'buffs',       label: 'Buffs'   },
  { key: 'group',       label: 'Group'   },
  { key: 'chat',        label: 'Chat'    },
  { key: 'combat',      label: 'Combat'  },
];
const DEFAULT_VISIBILITY: Record<PanelKey, boolean> = {
  spawns:      true,
  spawnPoints: true,
  stats:       true,
  buffs:       false,
  group:       true,
  chat:        true,
  combat:      false,
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
  const [leftSplit, setLeftSplit] = useState<number>(() => {
    const raw = localStorage.getItem(LEFT_SPLIT_STORAGE_KEY);
    const parsed = raw ? Number(raw) : DEFAULT_LEFT_SPLIT;
    return Number.isFinite(parsed) ? clampSplit(parsed) : DEFAULT_LEFT_SPLIT;
  });
  const leftRailRef = useRef<HTMLDivElement | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectOnCon, setSelectOnCon] = useState(() => localPrefs.selectOnConsider());
  const [selectOnTarget, setSelectOnTarget] = useState(() => localPrefs.selectOnTarget());
  const [deselectOnUntarget, setDeselectOnUntarget] = useState(() => localPrefs.deselectOnUntarget());
  // Live SeqClient for panels that need to send mutations back to the
  // daemon (e.g. FilterRulesPanel). Refreshed each time the URL changes.
  const clientRef = useRef<SeqClient | null>(null);

  const fastMachinePref = store.pref('Misc', 'FastMachine');
  const fastMachine =
    fastMachinePref?.value.case === 'boolValue'
      ? fastMachinePref.value.value
      : true;
  const toggleFastMachine = (v: boolean) => {
    clientRef.current?.setPref('Misc', 'FastMachine', { boolValue: v });
  };
  const updateSelectOnCon = (v: boolean) => {
    setSelectOnCon(v);
    localPrefs.setSelectOnConsider(v);
  };
  const updateSelectOnTarget = (v: boolean) => {
    setSelectOnTarget(v);
    localPrefs.setSelectOnTarget(v);
  };
  const updateDeselectOnUntarget = (v: boolean) => {
    setDeselectOnUntarget(v);
    localPrefs.setDeselectOnUntarget(v);
  };

  useEffect(() => {
    // Coarse tick that drives re-render of panels reading from the
    // mutate-in-place SpawnStore. 1Hz is a deliberate trade: distance
    // columns / hp percentages refresh once a second instead of every
    // 250ms, but with hundreds of spawns in a busy zone the 4Hz cadence
    // pegged the React reconciler (TanStack Table reorders by distance,
    // which fires hundreds of <tbody> insertBefore mutations per tick).
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    localStorage.setItem(PANEL_STORAGE_KEY, JSON.stringify(visibility));
  }, [visibility]);

  useEffect(() => {
    localStorage.setItem(RAIL_WIDTH_STORAGE_KEY, JSON.stringify(railWidths));
  }, [railWidths]);

  useEffect(() => {
    localStorage.setItem(LEFT_SPLIT_STORAGE_KEY, leftSplit.toString());
  }, [leftSplit]);

  const onLeftResize = useCallback((dx: number) => {
    setRailWidths((w) => ({ ...w, left: clampRail(w.left + dx) }));
  }, []);
  const onRightResize = useCallback((dx: number) => {
    // Right rail grows when you drag the handle leftward.
    setRailWidths((w) => ({ ...w, right: clampRail(w.right - dx) }));
  }, []);
  // Convert pixel-space drag delta into a fraction of the rail's
  // current height. Reading from the DOM avoids tracking a separate
  // resize observer for the rail container — its height is always
  // the parent flex row's full height minus the header.
  const onLeftSplitResize = useCallback((dy: number) => {
    const h = leftRailRef.current?.clientHeight ?? 0;
    if (h <= 0) return;
    setLeftSplit((s) => clampSplit(s + dy / h));
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
    clientRef.current = client;
    const detachEnv = client.onEnvelope((env) => store.apply(env));
    // Drive UI selection from /consider and target packets when the
    // user opted in via PreferencesPanel. localPrefs reads from
    // localStorage on each event so toggles take effect immediately —
    // no need to re-subscribe when the user flips them.
    const detachSelect = client.onEnvelope((env) => {
      const p = env.payload;
      // Mirrors showeq-c interface.cpp:5035-5061: deselect-on-untarget
      // runs independently of select-on-target — clearing the target
      // can drop the current selection even with select-on-target off.
      if (p.case === 'considered' && p.value.spawnId &&
          localPrefs.selectOnConsider()) {
        onSelect(p.value.spawnId);
      } else if (p.case === 'targeted') {
        if (p.value.spawnId === 0) {
          if (localPrefs.deselectOnUntarget()) onSelect(null);
        } else if (localPrefs.selectOnTarget()) {
          onSelect(p.value.spawnId);
        }
      }
    });
    const ws = { detach: () => { client.close(); detachEnv(); detachSelect(); } };

    const poll = setInterval(() => {
      const w = (client as unknown as { ws?: WebSocket }).ws;
      if (!w) return;
      switch (w.readyState) {
        case WebSocket.CONNECTING: setStatus('connecting'); break;
        case WebSocket.OPEN:       setStatus('connected');  break;
        default:                   setStatus('disconnected');
      }
    }, 500);

    client.connect();
    return () => {
      clearInterval(poll);
      ws.detach();
      if (clientRef.current === client) clientRef.current = null;
    };
  }, [store, url]);

  const showLeftRail = visibility.spawns || visibility.spawnPoints;
  const showRightRail =
    visibility.stats || visibility.buffs   || visibility.group ||
    visibility.chat  || visibility.combat;
  const bothLeftPanels = visibility.spawns && visibility.spawnPoints;

  return (
    <main className="flex h-screen w-screen flex-col bg-bg-base text-foreground">
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border bg-bg-panel px-3 py-2">
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
          className="w-80 rounded border border-border bg-bg-base px-2 py-1 font-mono text-xs text-foreground focus:border-blue-500 focus:outline-none"
        />
        <span className={`rounded px-2 py-0.5 text-xs ${STATUS_BADGE[status]}`}>
          {status}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Menubar className="h-6">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="flex items-center bg-primary px-2 text-xs font-medium text-primary-foreground select-none hover:bg-blue-600 focus:bg-primary focus:text-primary-foreground focus:outline-none"
            >
              Filters
            </button>
            <MenubarSeparator className="mx-0 my-0 h-auto w-px self-stretch" />
            <MenubarMenu>
              <MenubarTrigger
                className="bg-primary text-primary-foreground text-xs hover:bg-blue-600 focus:bg-primary focus:text-primary-foreground data-[state=open]:bg-blue-600 data-[state=open]:text-primary-foreground"
              >
                View
              </MenubarTrigger>
              <MenubarContent>
                {PANEL_DEFS.map((p) => (
                  <MenubarCheckboxItem
                    key={p.key}
                    checked={visibility[p.key]}
                    onCheckedChange={() => togglePanel(p.key)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {p.label}
                  </MenubarCheckboxItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
            <MenubarSeparator className="mx-0 my-0 h-auto w-px self-stretch" />
            <MenubarMenu>
              <MenubarTrigger
                className="bg-primary text-primary-foreground text-xs hover:bg-blue-600 focus:bg-primary focus:text-primary-foreground data-[state=open]:bg-blue-600 data-[state=open]:text-primary-foreground"
              >
                Options
              </MenubarTrigger>
              <MenubarContent>
                <MenubarCheckboxItem
                  checked={selectOnTarget}
                  onCheckedChange={updateSelectOnTarget}
                  onSelect={(e) => e.preventDefault()}
                >
                  Select on target
                </MenubarCheckboxItem>
                <MenubarCheckboxItem
                  checked={selectOnCon}
                  onCheckedChange={updateSelectOnCon}
                  onSelect={(e) => e.preventDefault()}
                >
                  Select on consider
                </MenubarCheckboxItem>
                <MenubarCheckboxItem
                  checked={deselectOnUntarget}
                  onCheckedChange={updateDeselectOnUntarget}
                  onSelect={(e) => e.preventDefault()}
                >
                  Deselect on untarget
                </MenubarCheckboxItem>
                <MenubarCheckboxItem
                  checked={fastMachine}
                  onCheckedChange={toggleFastMachine}
                  onSelect={(e) => e.preventDefault()}
                  disabled={status !== 'connected'}
                >
                  Fast machine
                </MenubarCheckboxItem>
                <MenubarLabel className="max-w-[18rem] pt-0 pl-8 text-[11px] font-normal text-muted-foreground whitespace-normal">
                  When enabled, distance-to-player uses 3D float math; off
                  uses 2D integer approximation. Takes effect on the next
                  position update.
                </MenubarLabel>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open settings"
            title="Settings"
            className="rounded px-2 py-0.5 text-base leading-none text-muted-foreground hover:bg-bg-base hover:text-foreground"
          >
            ⚙
          </button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        {showLeftRail && (
          <>
            <div
              ref={leftRailRef}
              className="flex shrink-0 flex-col"
              style={{ width: `${railWidths.left}px` }}
            >
              {visibility.spawns && (
                <Panel
                  title="Spawns"
                  onClose={() => hidePanel('spawns')}
                  className="min-h-0"
                  style={
                    bothLeftPanels
                      ? { flex: `${leftSplit} 1 0%` }
                      : { flex: '1 1 0%' }
                  }
                >
                  <SpawnList
                    store={store}
                    selectedId={selectedId}
                    onSelect={onSelect}
                  />
                </Panel>
              )}
              {bothLeftPanels && (
                <VerticalResizeHandle onDrag={onLeftSplitResize} />
              )}
              {visibility.spawnPoints && (
                <Panel
                  title="Spawn Points"
                  onClose={() => hidePanel('spawnPoints')}
                  className="min-h-0"
                  style={
                    bothLeftPanels
                      ? { flex: `${1 - leftSplit} 1 0%` }
                      : { flex: '1 1 0%' }
                  }
                >
                  <SpawnPointList store={store} tick={tick} />
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
            onSelect={onSelect}
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
      <SettingsModal
        open={settingsOpen}
        title="Preferences"
        onClose={() => setSettingsOpen(false)}
      >
        <PreferencesPanel
          store={store}
          client={clientRef.current}
          tick={tick}
        />
      </SettingsModal>
      <SettingsModal
        open={filtersOpen}
        title="Filters"
        onClose={() => setFiltersOpen(false)}
      >
        {clientRef.current ? (
          <FilterRulesPanel
            store={store}
            client={clientRef.current}
            tick={tick}
          />
        ) : (
          <div className="px-4 py-6 text-xs text-muted-foreground">Connecting…</div>
        )}
      </SettingsModal>
    </main>
  );
}
