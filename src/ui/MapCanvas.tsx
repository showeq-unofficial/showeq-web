import { useEffect, useRef } from 'react';
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

export function MapCanvas({ store }: { store: SpawnStore }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = '#0a0e12';
      ctx.fillRect(0, 0, w, h);

      const spawns = store.all();

      // Zero-centered world; scale factor picked so typical zone
      // extents fit. Real implementation uses player-centered view +
      // zone geometry in Phase 2.
      const scale = 0.4;
      const cx = w / 2;
      const cy = h / 2;

      for (const s of spawns) {
        const x = s.pos?.x ?? 0;
        const y = s.pos?.y ?? 0;
        const px = cx + x * scale;
        const py = cy - y * scale;
        ctx.fillStyle = COLOR_BY_TYPE[s.type] ?? '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '12px system-ui';
      ctx.fillText(`zone: ${store.zone() || '(none)'}`, 8, 16);
      ctx.fillText(`spawns: ${spawns.length}`, 8, 32);
      ctx.fillText(`seq: ${store.seq()}`, 8, 48);

      frame = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(frame);
  }, [store]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ background: '#0a0e12', border: '1px solid #333' }}
    />
  );
}
