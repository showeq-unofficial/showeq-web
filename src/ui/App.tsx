import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react';
import { flushSync } from 'react-dom';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ChatColorsPanel } from './ChatColorsPanel';
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
import { PlayerPanel } from './PlayerPanel';
import { LootWindow } from './LootWindow';
import { AAWindow } from './AAWindow';
import { SkillsWindow } from './SkillsWindow';
import { StatsWindow } from './StatsWindow';
import { InventoryStatsPanel } from './InventoryStatsPanel';
import { VerticalResizeHandle } from './VerticalResizeHandle';
import { FloatingWindow } from './FloatingWindow';
import { SnapZones, type SnapHint, type SnapSide } from './SnapZones';

type ConnStatus = 'disconnected' | 'connecting' | 'connected';

const STATUS_BADGE: Record<ConnStatus, string> = {
  connected:    'bg-emerald-700 text-emerald-100',
  connecting:   'bg-amber-700 text-amber-100',
  disconnected: 'bg-red-800 text-red-100',
};

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

type PanelKey =
  | 'spawns' | 'spawnPoints' | 'stats' | 'buffs' | 'group' | 'chat' | 'combat';
const PANEL_DEFS: { key: PanelKey; label: string }[] = [
  { key: 'spawns',      label: 'Spawns'  },
  { key: 'spawnPoints', label: 'Points'  },
  { key: 'stats',       label: 'Player'  },
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

// Where each panel lives. 'left' / 'right' = docked in that rail in
// PANEL_DEFS order; 'floating' = rendered as a FloatingWindow. The
// MapCanvas is intentionally not a PanelKey — it is always docked
// in the center.
type DockLocation = 'left' | 'right' | 'floating';
const DOCK_STORAGE_KEY = 'showeq.dockLocation';
const DEFAULT_DOCK_LOCATION: Record<PanelKey, 'left' | 'right'> = {
  spawns:      'left',
  spawnPoints: 'left',
  stats:       'right',
  buffs:       'right',
  group:       'right',
  combat:      'right',
  chat:        'right',
};
// Default sizes used when a panel is first detached — chosen to match
// each panel's typical docked footprint so the in-place detach gesture
// feels natural even before the user has resized.
const PANEL_DEFAULT_SIZES: Record<PanelKey, { w: number; h: number }> = {
  spawns:      { w: 380, h: 480 },
  spawnPoints: { w: 380, h: 300 },
  stats:       { w: 320, h: 320 },
  buffs:       { w: 300, h: 240 },
  group:       { w: 280, h: 200 },
  combat:      { w: 380, h: 280 },
  chat:        { w: 380, h: 320 },
};
// Title shown on detached panels — the View-menu label is too terse
// (e.g. "Points") for a window header.
const PANEL_TITLES: Record<PanelKey, string> = {
  spawns:      'Spawns',
  spawnPoints: 'Spawn Points',
  stats:       'Player',
  buffs:       'Buffs',
  group:       'Group',
  combat:      'Combat',
  chat:        'Chat',
};
// Panels that prefer to fill remaining vertical space when docked, so
// the rail's natural-height panels (Player/Buffs/Group) sit at the top
// and these expand. Used for both rails when a panel of either type
// gets docked there.
const FLEX_GROW_PANELS = new Set<PanelKey>(['spawns', 'spawnPoints', 'combat', 'chat']);
const SNAP_THRESHOLD_PX = 32;

// Per-rail render order. Reordering is achieved by moving a key inside
// its rail's array; cross-rail moves splice the key out of the source
// rail and into the target rail at the chosen slot. Floating panels
// remain in their *last-docked* rail's array so closing a floating
// panel and re-toggling it via View doesn't lose its slot.
const ORDER_STORAGE_KEY = 'showeq.panelOrder';
const DEFAULT_PANEL_ORDER: Record<'left' | 'right', PanelKey[]> = {
  left:  ['spawns', 'spawnPoints'],
  right: ['stats', 'buffs', 'group', 'chat', 'combat'],
};

function loadDockLocation(): Record<PanelKey, DockLocation> {
  try {
    const raw = localStorage.getItem(DOCK_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DOCK_LOCATION };
    const parsed = JSON.parse(raw) as Partial<Record<PanelKey, DockLocation>>;
    return { ...DEFAULT_DOCK_LOCATION, ...parsed };
  } catch {
    return { ...DEFAULT_DOCK_LOCATION };
  }
}

function loadPanelOrder(): Record<'left' | 'right', PanelKey[]> {
  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return { left: [...DEFAULT_PANEL_ORDER.left], right: [...DEFAULT_PANEL_ORDER.right] };
    const parsed = JSON.parse(raw) as Partial<Record<'left' | 'right', PanelKey[]>>;
    // Ensure every key is present in exactly one rail; missing keys
    // fall back to their default rail/slot.
    const result: Record<'left' | 'right', PanelKey[]> = {
      left:  Array.isArray(parsed.left)  ? parsed.left.filter(isPanelKey)  : [],
      right: Array.isArray(parsed.right) ? parsed.right.filter(isPanelKey) : [],
    };
    const seen = new Set<PanelKey>([...result.left, ...result.right]);
    for (const k of Object.keys(DEFAULT_DOCK_LOCATION) as PanelKey[]) {
      if (!seen.has(k)) result[DEFAULT_DOCK_LOCATION[k]].push(k);
    }
    return result;
  } catch {
    return { left: [...DEFAULT_PANEL_ORDER.left], right: [...DEFAULT_PANEL_ORDER.right] };
  }
}

function isPanelKey(v: unknown): v is PanelKey {
  return typeof v === 'string' && v in DEFAULT_DOCK_LOCATION;
}

// Translate a viewport-space rect into the FloatingWindow position
// system, which stores positions as an offset from the viewport's
// CSS center. Used when a panel is detached "in place" — we seed the
// floating window's pos so it spawns exactly where the docked panel was.
function rectToCenterOffset(rect: { x: number; y: number; w: number; h: number }) {
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  return { x: cx - window.innerWidth / 2, y: cy - window.innerHeight / 2 };
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
  const rightRailRef = useRef<HTMLDivElement | null>(null);
  const [dockLocation, setDockLocation] = useState<Record<PanelKey, DockLocation>>(() => loadDockLocation());
  const [panelOrder, setPanelOrder] = useState<Record<'left' | 'right', PanelKey[]>>(() => loadPanelOrder());
  const [snapHint, setSnapHint] = useState<SnapHint | null>(null);
  // Which floating dock panel (if any) is currently being dragged.
  // Snap zones only appear during dock-panel drags; the 5 floating
  // utility windows (Loot, Skills, AA, StatsWindow, Inventory) don't
  // dock and don't pass these callbacks.
  const dragKeyRef = useRef<PanelKey | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [aaWindowOpen, setAAWindowOpen] = useState(false);
  const [statsWindowOpen, setStatsWindowOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [lootOpen, setLootOpen] = useState(false);
  const [selectOnCon, setSelectOnCon] = useState(() => localPrefs.selectOnConsider());
  const [selectOnTarget, setSelectOnTarget] = useState(() => localPrefs.selectOnTarget());
  const [deselectOnUntarget, setDeselectOnUntarget] = useState(() => localPrefs.deselectOnUntarget());
  const [trackPlayer, setTrackPlayer] = useState(() => localPrefs.trackPlayer());
  const [smoothMovement, setSmoothMovement] = useState(() => localPrefs.smoothMovement());
  const [panelsLocked, setPanelsLocked] = useState(() => localPrefs.panelsLocked());
  const updatePanelsLocked = (v: boolean) => {
    setPanelsLocked(v);
    localPrefs.setPanelsLocked(v);
  };
  // Live SeqClient for panels that need to send mutations back to the
  // daemon (e.g. FilterRulesPanel). Refreshed each time the URL changes.
  const clientRef = useRef<SeqClient | null>(null);

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
  const updateTrackPlayer = (v: boolean) => {
    setTrackPlayer(v);
    localPrefs.setTrackPlayer(v);
  };
  const updateSmoothMovement = (v: boolean) => {
    setSmoothMovement(v);
    localPrefs.setSmoothMovement(v);
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

  useEffect(() => {
    localStorage.setItem(DOCK_STORAGE_KEY, JSON.stringify(dockLocation));
  }, [dockLocation]);

  useEffect(() => {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(panelOrder));
  }, [panelOrder]);

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

  // Detach a panel from its rail. If `anchor` is given (the panel's
  // current bounding rect), seed the FloatingWindow's persisted pos and
  // size so the floating instance appears in the same spot — gives the
  // user a smooth "pop out in place" feel rather than a jump-to-center.
  const undock = useCallback((key: PanelKey, anchor?: { x: number; y: number; w: number; h: number }) => {
    if (anchor) {
      const id = `panel.${key}`;
      const offset = rectToCenterOffset(anchor);
      try {
        localStorage.setItem(`showeq.windowPos.${id}`, JSON.stringify(offset));
        localStorage.setItem(`showeq.windowSize.${id}`, JSON.stringify({ w: anchor.w, h: anchor.h }));
      } catch { /* storage full — fall back to default centered */ }
    }
    setDockLocation((d) => ({ ...d, [key]: 'floating' }));
  }, []);

  // Move `key` into rail `side` at `slot` (0 = top, omitted = end).
  // Splices out of whichever rail's order array currently holds it,
  // then inserts at the requested slot in the target rail.
  const dockToSlot = useCallback((key: PanelKey, side: 'left' | 'right', slot?: number) => {
    setPanelOrder((order) => {
      const next: Record<'left' | 'right', PanelKey[]> = {
        left:  order.left.filter((k) => k !== key),
        right: order.right.filter((k) => k !== key),
      };
      const insertAt = slot === undefined ? next[side].length : Math.max(0, Math.min(next[side].length, slot));
      next[side] = [...next[side].slice(0, insertAt), key, ...next[side].slice(insertAt)];
      return next;
    });
    setDockLocation((d) => ({ ...d, [key]: side }));
  }, []);
  const resetDockTo = useCallback((key: PanelKey) => {
    dockToSlot(key, DEFAULT_DOCK_LOCATION[key]);
  }, [dockToSlot]);

  const resetLayout = useCallback(() => {
    setDockLocation({ ...DEFAULT_DOCK_LOCATION });
    setPanelOrder({
      left:  [...DEFAULT_PANEL_ORDER.left],
      right: [...DEFAULT_PANEL_ORDER.right],
    });
    setRailWidths({ left: DEFAULT_LEFT_WIDTH, right: DEFAULT_RIGHT_WIDTH });
    setLeftSplit(DEFAULT_LEFT_SPLIT);
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith('showeq.windowPos.panel.') || k.startsWith('showeq.windowSize.panel.')) {
        localStorage.removeItem(k);
      }
    }
  }, []);

  // Snap-zone hit test. Edge proximity OR overlapping the actual rail
  // both count — the latter handles the case where a rail is currently
  // collapsed (no panels left) and the user wants to drop a panel back
  // onto the empty space where the rail would be. Returns the side AND
  // the slot index where the panel will land based on the cursor's
  // vertical position relative to the existing panels.
  const hitTest = useCallback((rect: DOMRect): SnapHint | null => {
    const vw = window.innerWidth;
    let side: SnapSide | null = null;
    if (rect.left  <= SNAP_THRESHOLD_PX)            side = 'left';
    else if (rect.right >= vw - SNAP_THRESHOLD_PX)  side = 'right';
    else {
      const lr = leftRailRef.current?.getBoundingClientRect();
      if (lr && rect.left <= lr.right + SNAP_THRESHOLD_PX && rect.left >= lr.left - SNAP_THRESHOLD_PX) {
        side = 'left';
      } else {
        const rr = rightRailRef.current?.getBoundingClientRect();
        if (rr && rect.right >= rr.left - SNAP_THRESHOLD_PX && rect.right <= rr.right + SNAP_THRESHOLD_PX) {
          side = 'right';
        }
      }
    }
    if (!side) return null;
    const railEl = side === 'left' ? leftRailRef.current : rightRailRef.current;
    const cursorY = rect.top + rect.height / 2;
    if (!railEl) return { side, slot: 0 };
    const sections = [...railEl.querySelectorAll<HTMLElement>(':scope > section')];
    let slot = sections.length;
    for (let i = 0; i < sections.length; i++) {
      const r = sections[i].getBoundingClientRect();
      if (cursorY < r.top + r.height / 2) { slot = i; break; }
    }
    return { side, slot };
  }, []);

  const onFloatingDragStart = useCallback((key: PanelKey, rect: DOMRect) => {
    dragKeyRef.current = key;
    setSnapHint(hitTest(rect));
  }, [hitTest]);
  const onFloatingDrag = useCallback((rect: DOMRect) => {
    setSnapHint(hitTest(rect));
  }, [hitTest]);
  const onFloatingDragEnd = useCallback((key: PanelKey, rect: DOMRect) => {
    const z = hitTest(rect);
    dragKeyRef.current = null;
    setSnapHint(null);
    if (z) dockToSlot(key, z.side, z.slot);
  }, [dockToSlot, hitTest]);

  // Drag-out gesture: detach when the user mouses down on the panel
  // header and moves > 6 px. Buttons in the header (close/detach) are
  // exempt so they still click normally. Once the threshold is crossed
  // we flip dockLocation to 'floating', seeding the FloatingWindow's
  // pos and size to the panel's current bounds so the pop-out appears
  // in place. Then — critical for one-shot drag UX — we hand the drag
  // off to the new FloatingWindow's react-draggable by synthesizing
  // a mousedown on its drag handle at the current cursor position.
  // Without that handoff the user has to release and re-click to start
  // dragging the floated panel, which feels broken.
  const makeHeaderDragHandler = (key: PanelKey) => (e: ReactPointerEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    const header = e.currentTarget;
    const panelEl = header.parentElement;
    if (!panelEl) return;
    const rect = panelEl.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (dx * dx + dy * dy < 36) return;
      cleanup();
      // flushSync renders the FloatingWindow synchronously so the
      // synthetic mousedown fires in the same tick — no rAF gap during
      // which the cursor would drift, which on small panels (e.g. Buffs)
      // showed up as a visible jump when the drag picked up.
      flushSync(() => {
        undock(key, { x: rect.left, y: rect.top, w: rect.width, h: rect.height });
      });
      const fw = document.querySelector(`[data-fw-id="panel.${key}"] .fw-drag-handle`) as HTMLElement | null;
      if (!fw) return;
      fw.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true, cancelable: true, view: window,
        clientX: ev.clientX, clientY: ev.clientY, button: 0,
      }));
    };
    const cleanup = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', cleanup);
      window.removeEventListener('pointercancel', cleanup);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', cleanup);
    window.addEventListener('pointercancel', cleanup);
  };

  // Explicit "↗" button: same as drag-out, but triggered by click.
  // Reads the panel rect at click time so the floating window spawns
  // exactly where the docked panel lived.
  const makeDetachClickHandler = (key: PanelKey) => (e: React.MouseEvent<HTMLButtonElement>) => {
    const panelEl = e.currentTarget.closest('section') as HTMLElement | null;
    if (!panelEl) { undock(key); return; }
    const r = panelEl.getBoundingClientRect();
    undock(key, { x: r.left, y: r.top, w: r.width, h: r.height });
  };

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

  // A panel only contributes to its rail when both visible AND docked
  // there. Detached ('floating') panels are rendered separately below.
  const isDocked = (k: PanelKey, side: 'left' | 'right') =>
    visibility[k] && dockLocation[k] === side;
  const leftPanels  = panelOrder.left.filter((k) => isDocked(k, 'left'));
  const rightPanels = panelOrder.right.filter((k) => isDocked(k, 'right'));
  const showLeftRail  = leftPanels.length > 0;
  const showRightRail = rightPanels.length > 0;
  // The Spawns/SpawnPoints split survives only as long as those are the
  // only two left-rail panels — otherwise leftSplit isn't meaningful.
  const useLeftSplit =
    leftPanels.length === 2 &&
    leftPanels.includes('spawns') &&
    leftPanels.includes('spawnPoints');

  // Body content for each panel, reused for docked + floating render.
  // Co-located here so both branches stay in sync as panel props evolve.
  const renderPanelBody = (key: PanelKey): ReactNode => {
    switch (key) {
      case 'spawns':
        return <SpawnList store={store} selectedId={selectedId} onSelect={onSelect} />;
      case 'spawnPoints':
        return <SpawnPointList store={store} tick={tick} client={clientRef.current} />;
      case 'stats':
        return (
          <PlayerPanel
            store={store}
            tick={tick}
            onOpenSkills={() => setSkillsOpen(true)}
            onOpenStats={() => setStatsWindowOpen(true)}
            onOpenAA={() => setAAWindowOpen(true)}
            onOpenLoot={() => setLootOpen(true)}
            onOpenItems={() => setInventoryOpen(true)}
          />
        );
      case 'buffs':
        return <BuffsPanel store={store} tick={tick} />;
      case 'group':
        return <GroupPanel store={store} tick={tick} />;
      case 'combat':
        return <CombatLog store={store} tick={tick} />;
      case 'chat':
        return <ChatLog store={store} tick={tick} />;
    }
  };

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
          className="w-80 rounded border border-border bg-bg-base px-2 py-1 font-mono text-xs text-foreground focus:border-ring focus:outline-none"
        />
        <span className={`rounded px-2 py-0.5 text-xs ${STATUS_BADGE[status]}`}>
          {status}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Menubar className="h-6">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="flex items-center bg-primary px-2 text-xs font-medium text-primary-foreground select-none hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground focus:outline-none"
            >
              Filters
            </button>
            <MenubarSeparator className="mx-0 my-0 h-auto w-px self-stretch" />
            <MenubarMenu>
              <MenubarTrigger
                className="bg-primary text-primary-foreground text-xs hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground data-[state=open]:bg-primary/90 data-[state=open]:text-primary-foreground"
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
                <MenubarSeparator />
                <MenubarCheckboxItem
                  checked={panelsLocked}
                  onCheckedChange={updatePanelsLocked}
                  onSelect={(e) => e.preventDefault()}
                >
                  Lock panels
                </MenubarCheckboxItem>
                <MenubarItem onClick={resetLayout}>Reset layout</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarSeparator className="mx-0 my-0 h-auto w-px self-stretch" />
            <MenubarMenu>
              <MenubarTrigger
                className="bg-primary text-primary-foreground text-xs hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground data-[state=open]:bg-primary/90 data-[state=open]:text-primary-foreground"
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
                  checked={trackPlayer}
                  onCheckedChange={updateTrackPlayer}
                  onSelect={(e) => e.preventDefault()}
                >
                  Track player
                </MenubarCheckboxItem>
                <MenubarCheckboxItem
                  checked={smoothMovement}
                  onCheckedChange={updateSmoothMovement}
                  onSelect={(e) => e.preventDefault()}
                >
                  Smooth movement
                </MenubarCheckboxItem>
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
              {leftPanels.flatMap((k) => {
                const flexStyle = useLeftSplit
                  ? { flex: `${k === 'spawns' ? leftSplit : 1 - leftSplit} 1 0%` }
                  : FLEX_GROW_PANELS.has(k)
                  ? { flex: '1 1 0%' }
                  : undefined;
                const nodes = [
                  <Panel
                    key={k}
                    title={PANEL_TITLES[k]}
                    onClose={() => hidePanel(k)}
                    onDetach={panelsLocked ? undefined : makeDetachClickHandler(k)}
                    onHeaderPointerDown={panelsLocked ? undefined : makeHeaderDragHandler(k)}
                    className={FLEX_GROW_PANELS.has(k) || useLeftSplit ? 'min-h-0' : ''}
                    style={flexStyle}
                  >
                    {renderPanelBody(k)}
                  </Panel>,
                ];
                if (useLeftSplit && k === 'spawns') {
                  nodes.push(
                    <VerticalResizeHandle key={`${k}-split`} onDrag={onLeftSplitResize} />,
                  );
                }
                return nodes;
              })}
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
            trackPlayer={trackPlayer}
            onTrackPlayerChange={updateTrackPlayer}
            smoothMovement={smoothMovement}
          />
        </div>
        {showRightRail && (
          <>
            <ResizeHandle onDrag={onRightResize} />
            <div
              ref={rightRailRef}
              className="flex shrink-0 flex-col"
              style={{ width: `${railWidths.right}px` }}
            >
              {rightPanels.map((k) => (
                <Panel
                  key={k}
                  title={PANEL_TITLES[k]}
                  onClose={() => hidePanel(k)}
                  onDetach={panelsLocked ? undefined : makeDetachClickHandler(k)}
                  onHeaderPointerDown={panelsLocked ? undefined : makeHeaderDragHandler(k)}
                  className={FLEX_GROW_PANELS.has(k) ? 'min-h-0 flex-1' : ''}
                >
                  {renderPanelBody(k)}
                </Panel>
              ))}
            </div>
          </>
        )}
      </div>
      {skillsOpen && (
        <SkillsWindow
          store={store}
          tick={tick}
          onClose={() => setSkillsOpen(false)}
        />
      )}
      {aaWindowOpen && (
        <AAWindow
          store={store}
          tick={tick}
          onClose={() => setAAWindowOpen(false)}
        />
      )}
      {statsWindowOpen && (
        <StatsWindow
          store={store}
          tick={tick}
          onClose={() => setStatsWindowOpen(false)}
        />
      )}
      {inventoryOpen && (
        <InventoryStatsPanel
          store={store}
          tick={tick}
          onClose={() => setInventoryOpen(false)}
        />
      )}
      {lootOpen && (
        <LootWindow
          store={store}
          tick={tick}
          onClose={() => setLootOpen(false)}
        />
      )}
      {(['spawns','spawnPoints','stats','buffs','group','combat','chat'] as PanelKey[])
        .filter((k) => visibility[k] && dockLocation[k] === 'floating')
        .map((k) => (
          <FloatingWindow
            key={k}
            id={`panel.${k}`}
            title={PANEL_TITLES[k]}
            defaultSize={PANEL_DEFAULT_SIZES[k]}
            onClose={() => hidePanel(k)}
            onDock={panelsLocked ? undefined : () => resetDockTo(k)}
            onDragStart={panelsLocked ? undefined : (r) => onFloatingDragStart(k, r)}
            onDrag={panelsLocked ? undefined : onFloatingDrag}
            onDragEnd={panelsLocked ? undefined : (r) => onFloatingDragEnd(k, r)}
          >
            {renderPanelBody(k)}
          </FloatingWindow>
        ))}
      {snapHint !== null && (
        <SnapZones
          leftRailRef={leftRailRef}
          rightRailRef={rightRailRef}
          hint={snapHint}
        />
      )}
      <SettingsModal
        open={settingsOpen}
        title="Settings"
        onClose={() => setSettingsOpen(false)}
      >
        <Tabs defaultValue="preferences" className="gap-0">
          <TabsList className="sticky top-0 z-10 m-3 self-start bg-bg-panel">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="chat-colors">Chat Colors</TabsTrigger>
          </TabsList>
          <TabsContent value="preferences">
            <PreferencesPanel
              store={store}
              client={clientRef.current}
              tick={tick}
            />
          </TabsContent>
          <TabsContent value="chat-colors">
            <ChatColorsPanel />
          </TabsContent>
        </Tabs>
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
