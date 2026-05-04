import { useEffect, useMemo, useRef, useState } from 'react';
import type { SpawnStore } from '../state/store';
import { SpawnType } from '@gen/seq/v1/events_pb';
import { classNameOf } from './classes';
import { conHex, conOf } from './concolor';

// Fallback color when con-color isn't applicable: doors/drops have no
// level, and PC/NPC fall through here only before the player level
// syncs. Corpses get con-colored alongside live spawns to match the
// spawn list.
const COLOR_BY_TYPE: Record<number, string> = {
  [SpawnType.PC]:         '#6ec4ff',
  [SpawnType.NPC]:        '#ff6b6b',
  [SpawnType.CORPSE_PC]:  '#7070a0',
  [SpawnType.CORPSE_NPC]: '#706060',
  [SpawnType.DOOR]:       '#c0c0c0',
  [SpawnType.DROP]:       '#ffe066',
};

// Pixel radius for hit-testing on spawn dots — slightly larger than the
// 3px drawn dot so the click target is forgiving. Mirrors showeq-c's
// 15px `closestSpawnToPoint` distance for clicks (map.cpp:2051), with a
// tighter 10px radius for hover so labels don't follow the cursor across
// dense spawn fields.
const CLICK_HIT_RADIUS = 12;
const HOVER_HIT_RADIUS = 10;
// Movement threshold (canvas px) below which a mouse-up after mouse-down
// is treated as a click rather than a drag-pan.
const DRAG_THRESHOLD = 4;

type SpawnHit = { id: number; x: number; y: number };

// Per-spawn position with linear interpolation between the last two
// daemon updates. Daemon ships position updates at ~5 Hz; without lerp
// dots visibly teleport on each update. We lerp from the previously
// rendered position to the latest target across the inter-update
// interval, so motion looks continuous at the render rate.
type SmoothedPos = {
  prevX: number;
  prevY: number;
  targetX: number;
  targetY: number;
  updateTimeMs: number;
  durationMs: number;  // 0 = snap (no animation)
};

class PosSmoother {
  private readonly positions = new Map<number, SmoothedPos>();

  // Walk the current spawn set; stamp new ids, retarget moved ids, drop
  // disappeared ids. `players` is folded into the same map so the player
  // marker (drawn separately from the spawn loop) interpolates in lock
  // step with everyone else.
  sync(ids: Iterable<{ id: number; x: number; y: number }>, now: number) {
    const seen = new Set<number>();
    for (const { id, x, y } of ids) {
      seen.add(id);
      const cur = this.positions.get(id);
      if (!cur) {
        this.positions.set(id, {
          prevX: x, prevY: y,
          targetX: x, targetY: y,
          updateTimeMs: now, durationMs: 0,
        });
        continue;
      }
      if (cur.targetX === x && cur.targetY === y) continue;
      // Lerp from where we are *visually right now* so a fresh update
      // mid-animation slides cleanly instead of snapping back to the
      // prior `prev` anchor.
      const cp = this.posInternal(cur, now);
      cur.prevX = cp.x;
      cur.prevY = cp.y;
      cur.targetX = x;
      cur.targetY = y;
      // Use the actual inter-update interval as the lerp duration so the
      // animation finishes about when the next update arrives. Clamp:
      // too short = back to teleporting; too long = dots lag the truth
      // across pauses or zone-load gaps.
      const elapsed = now - cur.updateTimeMs;
      cur.durationMs = Math.min(600, Math.max(80, elapsed));
      cur.updateTimeMs = now;
    }
    for (const id of this.positions.keys()) {
      if (!seen.has(id)) this.positions.delete(id);
    }
  }

  posAt(id: number, now: number): { x: number; y: number } | undefined {
    const sp = this.positions.get(id);
    return sp ? this.posInternal(sp, now) : undefined;
  }

  private posInternal(sp: SmoothedPos, now: number) {
    if (sp.durationMs <= 0) return { x: sp.targetX, y: sp.targetY };
    const elapsed = now - sp.updateTimeMs;
    const t = Math.min(1, Math.max(0, elapsed / sp.durationMs));
    return {
      x: sp.prevX + (sp.targetX - sp.prevX) * t,
      y: sp.prevY + (sp.targetY - sp.prevY) * t,
    };
  }
}

export function MapCanvas({
  store,
  tick,
  selectedId,
  selectVersion,
  onSelect,
  trackPlayer,
  onTrackPlayerChange,
  smoothMovement,
}: {
  store: SpawnStore;
  tick: number;
  selectedId: number | null;
  selectVersion: number;
  onSelect: (id: number | null) => void;
  trackPlayer: boolean;
  onTrackPlayerChange: (v: boolean) => void;
  smoothMovement: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  // Position smoother — survives across re-renders so we never lose
  // mid-flight lerp state when React re-runs the render-loop effect.
  const smootherRef = useRef<PosSmoother | null>(null);
  if (smootherRef.current === null) smootherRef.current = new PosSmoother();
  // Latest projected screen positions of spawns + the player, refreshed
  // every render frame. Read by mouse handlers to do hit-testing without
  // re-projecting the world.
  const spawnHitsRef = useRef<SpawnHit[]>([]);
  // Hover state lives in React because the tooltip is a DOM overlay, not
  // a canvas draw. Updated on mousemove from the same hits ref.
  const [hover, setHover] = useState<{
    id: number;
    screenX: number;
    screenY: number;
  } | null>(null);
  const onSelectRef = useRef(onSelect);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  // Pan & zoom kept in refs so mouse events don't churn React state. The
  // render loop reads them every frame.
  const viewScaleRef = useRef(1);
  const panXRef = useRef(0);
  const panYRef = useRef(0);
  const lastZoneRef = useRef('');
  // Field-of-view radius around the player, in world units. Matches
  // showeq-c's MapIcons::m_fovDistance default (mapicon.cpp:797).
  const [fovDistance, setFovDistance] = useState(200);
  const fovDistanceRef = useRef(fovDistance);
  useEffect(() => { fovDistanceRef.current = fovDistance; }, [fovDistance]);
  // Selection drives a one-shot pan-to-center on the next render; the
  // render loop clears it after applying. Selection itself stays in props
  // so the highlight renders every frame.
  const pendingCenterRef = useRef<number | null>(null);
  const selectedIdRef = useRef<number | null>(null);
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);
  // When a selection originates from a click *on the map*, the view is
  // already showing the spawn — auto-recenter+zoom would just yank it
  // around. The click handler stamps this with the id it just selected
  // so the recenter effect below can skip exactly that change.
  const skipCenterForIdRef = useRef<number | null>(null);

  // On any (re-)select, request a center on next frame and bump zoom if
  // we're still zoomed out. Watching selectVersion as well as selectedId
  // means clicking the same row recenters.
  useEffect(() => {
    if (selectedId == null) return;
    if (skipCenterForIdRef.current === selectedId) {
      skipCenterForIdRef.current = null;
      return;
    }
    pendingCenterRef.current = selectedId;
    if (viewScaleRef.current < 3) viewScaleRef.current = 3;
  }, [selectedId, selectVersion]);

  // Visible layers — state because the toggle UI needs to re-render on
  // change. The render loop reads through a ref to avoid re-creating the
  // rAF loop on every toggle.
  const [visibleLayers, setVisibleLayers] = useState<Set<number>>(new Set());
  const visibleLayersRef = useRef(visibleLayers);
  useEffect(() => { visibleLayersRef.current = visibleLayers; }, [visibleLayers]);
  const [overlayCollapsed, setOverlayCollapsed] = useState<boolean>(
    () => localStorage.getItem('map.overlayCollapsed') === '1',
  );
  useEffect(() => {
    localStorage.setItem('map.overlayCollapsed', overlayCollapsed ? '1' : '0');
  }, [overlayCollapsed]);
  // Grid (mirrors showeq-c's MapData::paintGrid). Resolution in world
  // units — 500 matches mapcore.cpp:75. Default-on per the user request.
  const [showGrid, setShowGrid] = useState<boolean>(
    () => localStorage.getItem('map.showGrid') !== '0',
  );
  const showGridRef = useRef(showGrid);
  useEffect(() => {
    showGridRef.current = showGrid;
    localStorage.setItem('map.showGrid', showGrid ? '1' : '0');
  }, [showGrid]);
  const GRID_RESOLUTION = 500;
  // Track-player: when on, the render loop pins pan so the player sits at
  // the canvas center. Manual drag-pan flips it off via the parent-owned
  // setter so the user can look elsewhere without fighting the tracker.
  // Mirrors showeq-c's tFollowPlayer (map.h:98).
  const trackPlayerRef = useRef(trackPlayer);
  useEffect(() => { trackPlayerRef.current = trackPlayer; }, [trackPlayer]);
  // When false the smoother still ingests updates (so re-enabling is
  // instant), but smoothedPos returns the raw fallback — dots and the
  // player snap directly to each daemon update.
  const smoothMovementRef = useRef(smoothMovement);
  useEffect(() => { smoothMovementRef.current = smoothMovement; }, [smoothMovement]);
  const onTrackPlayerChangeRef = useRef(onTrackPlayerChange);
  useEffect(() => {
    onTrackPlayerChangeRef.current = onTrackPlayerChange;
  }, [onTrackPlayerChange]);
  // Render-rate cap. 0 = uncapped (every rAF tick paints). Otherwise we
  // gate the actual draw on `now - lastPaint >= 1000 / cap`. rAF still
  // fires at vsync so the throttle skips paints rather than sleeping —
  // browser already suspends rAF in inactive tabs.
  const [fpsCap, setFpsCap] = useState<number>(() => {
    const raw = localStorage.getItem('map.fpsCap');
    const n = raw == null ? 0 : Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  });
  const fpsCapRef = useRef(fpsCap);
  useEffect(() => {
    fpsCapRef.current = fpsCap;
    localStorage.setItem('map.fpsCap', String(fpsCap));
  }, [fpsCap]);

  // Detect zone change → reset view + show all layers in the new geometry.
  useEffect(() => {
    const z = store.zone();
    if (z === lastZoneRef.current) return;
    lastZoneRef.current = z;
    viewScaleRef.current = 1;
    panXRef.current = 0;
    panYRef.current = 0;

    const geom = store.map();
    const layers = new Set<number>();
    if (geom) {
      for (const l of geom.lines) layers.add(l.layer);
      for (const l of geom.locations) layers.add(l.layer);
    }
    setVisibleLayers(layers);
  }, [tick, store]);

  // Sync canvas backing-store size to its container, DPR-aware.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const sync = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sync();
    const obs = new ResizeObserver(sync);
    obs.observe(wrap);
    return () => obs.disconnect();
  }, []);

  // Mouse: drag to pan, click to select, hover to show name. Wheel zooms
  // (cursor-anchored).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Track the down-event so we can distinguish click (small movement)
    // from drag-pan. Pan starts on mousedown but a final movement under
    // DRAG_THRESHOLD also counts as a click.
    let dragOrigin: { x: number; y: number } | null = null;
    let downAt: { clientX: number; clientY: number } | null = null;
    let movedFar = false;

    const findHit = (clientX: number, clientY: number, radius: number) => {
      const rect = canvas.getBoundingClientRect();
      const cx = clientX - rect.left;
      const cy = clientY - rect.top;
      const r2 = radius * radius;
      let best: SpawnHit | null = null;
      let bestD2 = Infinity;
      for (const h of spawnHitsRef.current) {
        const dx = h.x - cx;
        const dy = h.y - cy;
        const d2 = dx * dx + dy * dy;
        if (d2 <= r2 && d2 < bestD2) {
          bestD2 = d2;
          best = h;
        }
      }
      return best;
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      dragOrigin = {
        x: e.clientX - panXRef.current,
        y: e.clientY - panYRef.current,
      };
      downAt = { clientX: e.clientX, clientY: e.clientY };
      movedFar = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (dragOrigin && downAt) {
        const dx = e.clientX - downAt.clientX;
        const dy = e.clientY - downAt.clientY;
        if (!movedFar && dx * dx + dy * dy > DRAG_THRESHOLD * DRAG_THRESHOLD) {
          movedFar = true;
          // Manual pan releases tracking so the user can look elsewhere
          // without the next render snapping the view back.
          if (trackPlayerRef.current) onTrackPlayerChangeRef.current(false);
        }
        if (movedFar) {
          panXRef.current = e.clientX - dragOrigin.x;
          panYRef.current = e.clientY - dragOrigin.y;
          // Pan invalidates whatever was under the cursor before.
          setHover((h) => (h ? null : h));
        }
        return;
      }
      // Hover hit-test (only when not dragging).
      const hit = findHit(e.clientX, e.clientY, HOVER_HIT_RADIUS);
      if (!hit) {
        setHover((h) => (h ? null : h));
        return;
      }
      // Canvas-local coords; wrap div is `relative` so absolute children
      // position against the same origin.
      setHover({ id: hit.id, screenX: hit.x, screenY: hit.y });
    };
    const onMouseUp = (e: MouseEvent) => {
      const wasClick = dragOrigin != null && !movedFar && e.button === 0;
      dragOrigin = null;
      downAt = null;
      if (!wasClick) return;
      // Click: select nearest spawn within CLICK_HIT_RADIUS, or clear
      // selection on empty space (matches the showeq-c behavior of
      // requiring a hit but pairs well with the SpawnList row toggle).
      const hit = findHit(e.clientX, e.clientY, CLICK_HIT_RADIUS);
      if (hit) {
        skipCenterForIdRef.current = hit.id;
        onSelectRef.current(hit.id);
      }
    };
    const onMouseLeave = () => setHover(null);
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      const oldScale = viewScaleRef.current;
      const newScale = Math.max(0.1, Math.min(50, oldScale * factor));
      // When tracking, pan is overridden every frame to pin the player —
      // cursor-anchored zoom would just flicker before the tracker wins.
      // Zoom around the player (already at canvas center) instead.
      if (trackPlayerRef.current) {
        viewScaleRef.current = newScale;
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      // Keep the world point under the cursor stationary: shift pan by the
      // change in canvas-space distance from center after scaling.
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const offX = cx - centerX - panXRef.current;
      const offY = cy - centerY - panYRef.current;
      const ratio = newScale / oldScale;
      panXRef.current -= offX * (ratio - 1);
      panYRef.current -= offY * (ratio - 1);
      viewScaleRef.current = newScale;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Render loop.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    // Sliding 1-second frame counter for the HUD's fps line. rAF fires
    // continuously, so this measures actual paint cadence (not just
    // state changes the way iced-miseru's cache-driven counter does).
    const fpsStats = { count: 0, lastReset: 0, fps: 0 };
    // Cumulative paint deadline. Resetting to `now` each paint aliases
    // when the display refresh isn't a multiple of the cap — e.g. 90Hz
    // + cap=60 drops to 45fps because two 11.11ms rAFs land before the
    // 16.67ms gate opens, making every other paint slip a vsync.
    // Accumulating the deadline keeps the cadence on the cap, not on
    // whichever rAF first crossed the threshold.
    let nextPaint = 0;
    const render = () => {
      const cap = fpsCapRef.current;
      if (cap > 0) {
        const now = performance.now();
        const interval = 1000 / cap;
        // 0.5ms slack so a vsync that lands a hair early still counts.
        if (now < nextPaint - 0.5) {
          frame = requestAnimationFrame(render);
          return;
        }
        // First frame or fell more than one interval behind: resync to
        // now. Otherwise advance by exactly `interval` to hold cadence.
        nextPaint = nextPaint === 0 || now > nextPaint + interval
          ? now + interval
          : nextPaint + interval;
      }
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.fillStyle = '#0a0e12';
      ctx.fillRect(0, 0, w, h);

      const geom = store.map();
      const spawns = store.all();
      const player = store.player();
      const visible = visibleLayersRef.current;

      // Refresh smoother against the latest store state — adds new ids,
      // retargets moved ids, prunes removed ids. `pos` may be missing on
      // a freshly-spawned record before the first OP_ClientUpdate (rare
      // but observed); skip those so we don't peg them at (0, 0).
      const smoother = smootherRef.current!;
      const animNow = performance.now();
      smoother.sync(
        (function* () {
          for (const s of spawns) {
            if (!s.pos) continue;
            yield { id: s.id, x: s.pos.x, y: s.pos.y };
          }
        })(),
        animNow,
      );
      const smoothedPos = (id: number, fallback: { x: number; y: number }) =>
        (smoothMovementRef.current ? smoother.posAt(id, animNow) : fallback) ?? fallback;

      // Pick viewport bounds: zone geometry → spawn-derived → fallback box.
      let minX: number, minY: number, maxX: number, maxY: number;
      if (geom && (geom.minX !== 0 || geom.maxX !== 0)) {
        minX = geom.minX; minY = geom.minY;
        maxX = geom.maxX; maxY = geom.maxY;
      } else if (spawns.length > 0) {
        minX = minY = Infinity; maxX = maxY = -Infinity;
        for (const s of spawns) {
          const x = s.pos?.x ?? 0, y = s.pos?.y ?? 0;
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
      } else {
        minX = -1000; minY = -1000; maxX = 1000; maxY = 1000;
      }

      const zoneW = Math.max(1, maxX - minX);
      const zoneH = Math.max(1, maxY - minY);
      const baseScale = Math.min(w / zoneW, h / zoneH) * 0.92;
      const scale = baseScale * viewScaleRef.current;
      const ccx = (minX + maxX) / 2;
      const ccy = (minY + maxY) / 2;
      // Coords arrive in screen convention (+X right, +Y down) — the
      // daemon pre-negates EQ runtime coords at proto serialization time
      // (see showeq-daemon/src/protoencoder.cpp fillPos / fillMapGeometry,
      // and the seq.v1 Pos message comment). Projection is identity on
      // the coords; pan adds an additional screen-pixel offset.
      // Apply a pending center request (from a SpawnList click). We need
      // ccx/ccy/scale to be known before computing pan, hence handling it
      // here rather than in the selection effect.
      if (pendingCenterRef.current != null) {
        const target = spawns.find((s) => s.id === pendingCenterRef.current);
        if (target?.pos) {
          const tp = smoothedPos(target.id, target.pos);
          panXRef.current = -(tp.x - ccx) * scale;
          panYRef.current = -(tp.y - ccy) * scale;
        }
        pendingCenterRef.current = null;
      }

      // Track-player: pin pan so the player stays at the canvas center.
      // Wins over pendingCenter — clicking a far spawn while tracking
      // bumps zoom (selection effect) but keeps the view on the player.
      // Uses the smoothed player position so the camera glides with the
      // marker instead of snapping at each daemon update.
      if (trackPlayerRef.current && player?.pos) {
        const pp = smoothedPos(player.id, player.pos);
        panXRef.current = -(pp.x - ccx) * scale;
        panYRef.current = -(pp.y - ccy) * scale;
      }

      const project = (x: number, y: number): [number, number] => [
        w / 2 + (x - ccx) * scale + panXRef.current,
        h / 2 + (y - ccy) * scale + panYRef.current,
      ];

      // Grid (underlay). Ports MapData::paintGrid (mapcore.cpp:1666):
      // vertical+horizontal lines at every gridResolution world units,
      // tick labels at each intersection. Only iterate the lines whose
      // screen-space position falls within the canvas to keep large
      // zones cheap.
      if (showGridRef.current) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#194819';
        ctx.font = '10px system-ui';
        ctx.fillStyle = '#e1c819';
        // World-space bounds of the visible viewport. Inverting the
        // Inverse of project(): world_x = ccx + (sx - w/2 - panX) / scale.
        const worldLeft   = ccx + (0 - w / 2 - panXRef.current) / scale;
        const worldRight  = ccx + (w - w / 2 - panXRef.current) / scale;
        const worldTop    = ccy + (0 - h / 2 - panYRef.current) / scale;
        const worldBottom = ccy + (h - h / 2 - panYRef.current) / scale;
        // Project flips both axes (see calcXOffsetI mirror), so worldLeft
        // is actually the larger world-x. Normalize.
        const wxMin = Math.min(worldLeft, worldRight);
        const wxMax = Math.max(worldLeft, worldRight);
        const wyMin = Math.min(worldTop, worldBottom);
        const wyMax = Math.max(worldTop, worldBottom);
        const startX = Math.ceil(wxMin / GRID_RESOLUTION) * GRID_RESOLUTION;
        const startY = Math.ceil(wyMin / GRID_RESOLUTION) * GRID_RESOLUTION;
        for (let gx = startX; gx <= wxMax; gx += GRID_RESOLUTION) {
          const [sx] = project(gx, 0);
          ctx.beginPath();
          ctx.moveTo(sx, 0);
          ctx.lineTo(sx, h);
          ctx.stroke();
          ctx.fillText(String(gx), sx + 2, h - 2);
        }
        for (let gy = startY; gy <= wyMax; gy += GRID_RESOLUTION) {
          const [, sy] = project(0, gy);
          ctx.beginPath();
          ctx.moveTo(0, sy);
          ctx.lineTo(w, sy);
          ctx.stroke();
          ctx.fillText(String(gy), 2, sy - 2);
        }
      }

      if (geom) {
        ctx.lineWidth = 1;
        for (const line of geom.lines) {
          if (!visible.has(line.layer)) continue;
          const n = line.x.length;
          if (n < 2) continue;
          ctx.strokeStyle = line.color || '#4a6070';
          ctx.beginPath();
          const [sx, sy] = project(line.x[0], line.y[0]);
          ctx.moveTo(sx, sy);
          for (let i = 1; i < n; i++) {
            const [px, py] = project(line.x[i], line.y[i]);
            ctx.lineTo(px, py);
          }
          ctx.stroke();
        }

        ctx.font = '10px system-ui';
        for (const loc of geom.locations) {
          if (!visible.has(loc.layer)) continue;
          const [lx, ly] = project(loc.x, loc.y);
          ctx.fillStyle = loc.color || 'rgba(255,255,255,0.5)';
          ctx.fillText(loc.name, lx + 3, ly);
        }
      }

      // Spawns.
      const selId = selectedIdRef.current;
      // Prefer PlayerStats.level over the Spawn record: the daemon never
      // resends the player's Spawn after a ding, so Spawn.level is frozen
      // at zone-in. PlayerStats.level is bumped on OP_LevelUpdate.
      const pLevel = store.stats()?.level ?? player?.level ?? 0;
      // Rebuild hit-test list each frame; we add the player below.
      const hits: SpawnHit[] = [];
      let selectedScreen: { x: number; y: number } | null = null;
      for (const s of spawns) {
        if (s.id === player?.id) continue;
        const sp = smoothedPos(s.id, s.pos ?? { x: 0, y: 0 });
        const [px, py] = project(sp.x, sp.y);
        hits.push({ id: s.id, x: px, y: py });
        if (s.id === selId) selectedScreen = { x: px, y: py };
        // Group-member ring (under selection ring so selection wins).
        if (store.isGroupSpawn(s.id)) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (s.id === selId) {
          ctx.strokeStyle = '#ffd24a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px, py, 8, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle =
          pLevel > 0 && s.level > 0
            ? conHex(conOf(pLevel, s.level))
            : COLOR_BY_TYPE[s.type] ?? '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Player marker + viewport (FOV ellipse) + view direction (yellow
      // center line + red cone). Ports showeq-c's paintPlayerBackground +
      // paintPlayerView from showeq-c/src/map.cpp:3530-3593.
      if (player?.pos) {
        const pp = smoothedPos(player.id, player.pos);
        const [px, py] = project(pp.x, pp.y);
        const scaledFov = fovDistanceRef.current * scale;
        if (player.id) hits.push({ id: player.id, x: px, y: py });

        // Magenta line from player to selected spawn — ports
        // tIconTypeItemSelected's setLine0(true, Qt::magenta) +
        // MapIcons::paintIcon (showeq-c/src/mapicon.cpp:689,941-947).
        if (selectedScreen && selId !== player.id) {
          ctx.strokeStyle = '#ff00ff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(selectedScreen.x, selectedScreen.y);
          ctx.stroke();
        }

        // FOV background ellipse (semi-transparent fill, drawn under the
        // marker for context).
        ctx.fillStyle = 'rgba(80, 80, 80, 0.22)';
        ctx.strokeStyle = 'rgba(80, 80, 80, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px, py, scaledFov, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Selection highlight ring.
        if (player.id === selId) {
          ctx.strokeStyle = '#ffd24a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px, py, 9, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Player dot.
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Heading is sent as compass degrees 0..359 (see seq.v1 Pos.heading
        // — the daemon converts from EQ's raw 12-bit / 8-bit forms before
        // serializing). showeq-c's paintPlayerView formula then maps that
        // to a canvas-space angle (sin → +X right, cos → +Y down, 0°↑).
        const headingDegrees = player.pos.heading ?? 0;
        const angle = ((360 - headingDegrees - 180) / 360) * 2 * Math.PI;

        const playerCircleRadius = 4;
        const fovHalfAngle = (Math.PI * 2) * 0.25 / 2; // 45° each side

        // Center line — yellow.
        ctx.strokeStyle = '#ffd200';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(
          px + Math.sin(angle) * scaledFov,
          py + Math.cos(angle) * scaledFov,
        );
        ctx.stroke();

        // Cone edges — red. Two lines starting from opposite sides of the
        // player circle, spreading at ±fovHalfAngle from heading.
        let startOffsetX = Math.sin(angle - Math.PI / 2) * playerCircleRadius;
        let startOffsetY = Math.cos(angle - Math.PI / 2) * playerCircleRadius;
        let coneOffset = fovHalfAngle;
        ctx.strokeStyle = '#ff3030';
        ctx.lineWidth = 1.25;
        for (let n = 0; n < 2; n++) {
          const sx = px + startOffsetX;
          const sy = py + startOffsetY;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(
            sx + Math.sin(angle - coneOffset) * scaledFov,
            sy + Math.cos(angle - coneOffset) * scaledFov,
          );
          ctx.stroke();
          startOffsetX = -startOffsetX;
          startOffsetY = -startOffsetY;
          coneOffset = -coneOffset;
        }
      }

      const now = performance.now();
      if (fpsStats.lastReset === 0) fpsStats.lastReset = now;
      fpsStats.count++;
      const elapsed = now - fpsStats.lastReset;
      if (elapsed >= 1000) {
        fpsStats.fps = (fpsStats.count * 1000) / elapsed;
        fpsStats.count = 0;
        fpsStats.lastReset = now;
      }

      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '12px system-ui';
      const zoneLabel = store.zoneLongName() || store.zone() || '(none)';
      ctx.fillText(`zone: ${zoneLabel}`, 8, 16);
      ctx.fillText(`spawns: ${spawns.length}`, 8, 32);
      ctx.fillText(`seq: ${store.seq()}`, 8, 48);
      ctx.fillText(`zoom: ${viewScaleRef.current.toFixed(2)}x`, 8, 64);
      ctx.fillText(`fps: ${fpsStats.fps.toFixed(0)}`, 8, 80);

      // Publish hits for hit-testing in mouse handlers. Done last so any
      // dot painted this frame is selectable on the next event.
      spawnHitsRef.current = hits;

      frame = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(frame);
  }, [store]);

  // Layers present in current geometry — derives the toggle UI list.
  const availableLayers = useMemo(() => {
    void tick;
    const s = new Set<number>();
    const geom = store.map();
    if (geom) {
      for (const l of geom.lines) s.add(l.layer);
      for (const l of geom.locations) s.add(l.layer);
    }
    return Array.from(s).sort((a, b) => a - b);
  }, [tick, store]);

  const toggleLayer = (layer: number) => {
    setVisibleLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  };

  const allOn = () => setVisibleLayers(new Set(availableLayers));
  const allOff = () => setVisibleLayers(new Set());

  const resetView = () => {
    viewScaleRef.current = 1;
    panXRef.current = 0;
    panYRef.current = 0;
  };

  return (
    <div ref={wrapRef} className="relative h-full w-full select-none bg-bg-base">
      <canvas
        ref={canvasRef}
        className="block cursor-grab active:cursor-grabbing"
      />
      <HoverTip store={store} hover={hover} />
      <div
        className={
          'absolute right-2 top-2 rounded border border-border bg-bg-panel/95 text-xs shadow-md backdrop-blur ' +
          (overlayCollapsed ? '' : 'min-w-[160px] p-2')
        }
      >
        <div
          className={
            'flex items-center justify-between gap-2 ' +
            (overlayCollapsed ? 'p-1' : 'mb-1')
          }
        >
          <button
            type="button"
            onClick={() => setOverlayCollapsed((c) => !c)}
            className="text-muted-foreground hover:text-foreground"
            title={overlayCollapsed ? 'Expand layers' : 'Collapse layers'}
            aria-label={overlayCollapsed ? 'Expand layers' : 'Collapse layers'}
          >
            {overlayCollapsed ? '▸' : '▾'}
          </button>
          {!overlayCollapsed && (
            <>
              <span className="flex-1 font-medium text-foreground">Layers</span>
              <button
                type="button"
                onClick={resetView}
                className="rounded border border-border bg-bg-alt px-1.5 py-0.5 text-[10px] text-foreground hover:bg-bg-base"
                title="Reset zoom + pan"
              >
                reset view
              </button>
            </>
          )}
        </div>
        {!overlayCollapsed && (
        <>
        <label className="mb-2 flex items-center gap-1 text-[11px] text-muted-foreground">
          <span className="w-7 shrink-0">FOV</span>
          <input
            type="range"
            min={20}
            max={1200}
            step={20}
            value={fovDistance}
            onChange={(e) => setFovDistance(Number(e.target.value))}
            className="flex-1 accent-blue-500"
          />
          <span className="w-8 shrink-0 text-right tabular-nums">{fovDistance}</span>
        </label>
        <label className="mb-2 flex items-center gap-1 text-[11px] text-foreground">
          <span className="w-7 shrink-0 text-muted-foreground">FPS</span>
          <select
            value={fpsCap}
            onChange={(e) => setFpsCap(Number(e.target.value))}
            className="flex-1 rounded border border-border bg-bg-alt px-1 py-0.5 text-[11px] text-foreground"
          >
            <option value={0}>uncap</option>
            <option value={30}>30</option>
            <option value={60}>60</option>
          </select>
        </label>
        <label className="mb-2 flex cursor-pointer items-center gap-1 text-[11px] text-foreground">
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
            className="h-3 w-3 accent-blue-500"
          />
          Grid
        </label>
        {availableLayers.length === 0 ? (
          <div className="text-muted-foreground">no map loaded</div>
        ) : (
          <>
            <div className="flex flex-col gap-0.5">
              {availableLayers.map((layer) => (
                <label
                  key={layer}
                  className="flex cursor-pointer items-center gap-1 text-[11px] text-foreground"
                >
                  <input
                    type="checkbox"
                    checked={visibleLayers.has(layer)}
                    onChange={() => toggleLayer(layer)}
                    className="h-3 w-3 accent-blue-500"
                  />
                  Layer {layer}
                </label>
              ))}
            </div>
            <div className="mt-1 flex gap-1 border-t border-border pt-1">
              <button
                type="button"
                onClick={allOn}
                className="flex-1 rounded border border-border bg-bg-alt px-1 py-0.5 text-[10px] text-foreground hover:bg-bg-base"
              >
                all
              </button>
              <button
                type="button"
                onClick={allOff}
                className="flex-1 rounded border border-border bg-bg-alt px-1 py-0.5 text-[10px] text-foreground hover:bg-bg-base"
              >
                none
              </button>
            </div>
          </>
        )}
        </>
        )}
      </div>
    </div>
  );
}

// Hover tooltip — mirrors the shape of showeq-c's MapTip popup
// (map.cpp:4438-4523) but trimmed to the fields the daemon ships:
// no race string, no guild tag. Positioned at the cursor with a small
// down-right offset to match the showeq-c +15px nudge.
function HoverTip({
  store,
  hover,
}: {
  store: SpawnStore;
  hover: { id: number; screenX: number; screenY: number } | null;
}) {
  if (!hover) return null;
  const spawn = store.all().find((s) => s.id === hover.id);
  if (!spawn) return null;
  const baseName = spawn.name || '(unnamed)';
  const display = spawn.lastName ? `${baseName} (${spawn.lastName})` : baseName;
  const hpPct =
    spawn.hpMax > 0 ? Math.round((spawn.hpCur / spawn.hpMax) * 100) : null;
  const cls = classNameOf(spawn.class);
  return (
    <div
      style={{ left: hover.screenX + 12, top: hover.screenY + 12 }}
      className="pointer-events-none absolute z-10 max-w-[220px] rounded border border-border bg-bg-panel/95 px-2 py-1 text-[11px] text-foreground shadow-md backdrop-blur"
    >
      <div className="truncate font-medium">{display}</div>
      <div className="text-muted-foreground">
        L{spawn.level || '?'}
        {hpPct != null ? ` · ${hpPct}% HP` : ''}
        {cls ? ` · ${cls}` : ''}
      </div>
      <div className="tabular-nums text-muted-foreground">
        {Math.round(spawn.pos?.x ?? 0)}, {Math.round(spawn.pos?.y ?? 0)},{' '}
        {Math.round(spawn.pos?.z ?? 0)}
      </div>
    </div>
  );
}
