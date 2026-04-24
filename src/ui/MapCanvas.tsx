import { useEffect, useMemo, useRef, useState } from 'react';
import type { SpawnStore } from '../state/store';
import { SpawnType } from '@gen/seq/v1/events_pb';

const COLOR_BY_TYPE: Record<number, string> = {
  [SpawnType.PC]:         '#6ec4ff',
  [SpawnType.NPC]:        '#ff6b6b',
  [SpawnType.CORPSE_PC]:  '#7070a0',
  [SpawnType.CORPSE_NPC]: '#706060',
  [SpawnType.DOOR]:       '#c0c0c0',
  [SpawnType.DROP]:       '#ffe066',
};

export function MapCanvas({
  store,
  tick,
  selectedId,
  selectVersion,
}: {
  store: SpawnStore;
  tick: number;
  selectedId: number | null;
  selectVersion: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

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

  // On any (re-)select, request a center on next frame and bump zoom if
  // we're still zoomed out. Watching selectVersion as well as selectedId
  // means clicking the same row recenters.
  useEffect(() => {
    if (selectedId == null) return;
    pendingCenterRef.current = selectedId;
    if (viewScaleRef.current < 3) viewScaleRef.current = 3;
  }, [selectedId, selectVersion]);

  // Visible layers — state because the toggle UI needs to re-render on
  // change. The render loop reads through a ref to avoid re-creating the
  // rAF loop on every toggle.
  const [visibleLayers, setVisibleLayers] = useState<Set<number>>(new Set());
  const visibleLayersRef = useRef(visibleLayers);
  useEffect(() => { visibleLayersRef.current = visibleLayers; }, [visibleLayers]);

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

  // Mouse: drag to pan, wheel to zoom (cursor-anchored).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let dragOrigin: { x: number; y: number } | null = null;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      dragOrigin = {
        x: e.clientX - panXRef.current,
        y: e.clientY - panYRef.current,
      };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!dragOrigin) return;
      panXRef.current = e.clientX - dragOrigin.x;
      panYRef.current = e.clientY - dragOrigin.y;
    };
    const onMouseUp = () => { dragOrigin = null; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      const oldScale = viewScaleRef.current;
      const newScale = Math.max(0.1, Math.min(50, oldScale * factor));
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
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
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
    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.fillStyle = '#0a0e12';
      ctx.fillRect(0, 0, w, h);

      const geom = store.map();
      const spawns = store.all();
      const player = store.player();
      const visible = visibleLayersRef.current;

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
      // EQ map+spawn convention (matched against showeq-c/src/map.cpp's
      // calcXOffsetI / calcYOffsetI): both x and y are inverted for screen
      // space. loadSOEMap negates the file values into MapData; showeq-c's
      // render pass negates again, which is what we mirror here. Without
      // the X negation everything draws mirrored.
      // Apply a pending center request (from a SpawnList click). We need
      // ccx/ccy/scale to be known before computing pan, hence handling it
      // here rather than in the selection effect.
      if (pendingCenterRef.current != null) {
        const target = spawns.find((s) => s.id === pendingCenterRef.current);
        if (target?.pos) {
          panXRef.current = (target.pos.x - ccx) * scale;
          panYRef.current = (target.pos.y - ccy) * scale;
        }
        pendingCenterRef.current = null;
      }

      const project = (x: number, y: number): [number, number] => [
        w / 2 - (x - ccx) * scale + panXRef.current,
        h / 2 - (y - ccy) * scale + panYRef.current,
      ];

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
      for (const s of spawns) {
        if (s.id === player?.id) continue;
        const [px, py] = project(s.pos?.x ?? 0, s.pos?.y ?? 0);
        if (s.id === selId) {
          ctx.strokeStyle = '#ffd24a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px, py, 8, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = COLOR_BY_TYPE[s.type] ?? '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Player marker + viewport (FOV ellipse) + view direction (yellow
      // center line + red cone). Ports showeq-c's paintPlayerBackground +
      // paintPlayerView from showeq-c/src/map.cpp:3530-3593.
      if (player?.pos) {
        const [px, py] = project(player.pos.x, player.pos.y);
        const scaledFov = fovDistanceRef.current * scale;

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

      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '12px system-ui';
      const zoneLabel = store.zoneLongName() || store.zone() || '(none)';
      ctx.fillText(`zone: ${zoneLabel}`, 8, 16);
      ctx.fillText(`spawns: ${spawns.length}`, 8, 32);
      ctx.fillText(`seq: ${store.seq()}`, 8, 48);
      ctx.fillText(`zoom: ${viewScaleRef.current.toFixed(2)}x`, 8, 64);

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
      <div className="absolute right-2 top-2 min-w-[160px] rounded border border-neutral-800 bg-bg-panel/95 p-2 text-xs shadow-md backdrop-blur">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="font-medium text-neutral-300">Layers</span>
          <button
            type="button"
            onClick={resetView}
            className="rounded border border-neutral-700 bg-bg-alt px-1.5 py-0.5 text-[10px] text-neutral-300 hover:bg-bg-base"
            title="Reset zoom + pan"
          >
            reset view
          </button>
        </div>
        <label className="mb-2 flex items-center gap-1 text-[11px] text-neutral-400">
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
        {availableLayers.length === 0 ? (
          <div className="text-neutral-500">no map loaded</div>
        ) : (
          <>
            <div className="flex flex-col gap-0.5">
              {availableLayers.map((layer) => (
                <label
                  key={layer}
                  className="flex cursor-pointer items-center gap-1 text-[11px] text-neutral-300"
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
            <div className="mt-1 flex gap-1 border-t border-neutral-800 pt-1">
              <button
                type="button"
                onClick={allOn}
                className="flex-1 rounded border border-neutral-700 bg-bg-alt px-1 py-0.5 text-[10px] text-neutral-300 hover:bg-bg-base"
              >
                all
              </button>
              <button
                type="button"
                onClick={allOff}
                className="flex-1 rounded border border-neutral-700 bg-bg-alt px-1 py-0.5 text-[10px] text-neutral-300 hover:bg-bg-base"
              >
                none
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
