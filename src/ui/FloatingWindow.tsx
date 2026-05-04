import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from 'react-draggable';
import { localPrefs, type WindowSize } from '../state/localPrefs';

const DEFAULT_MIN_SIZE: WindowSize = { w: 200, h: 120 };

export type FloatingWindowProps = {
  id: string;
  title: ReactNode;
  defaultSize: WindowSize;
  minSize?: WindowSize;
  onClose?: () => void;
  // When set, renders a "↘" Dock button — used by detached dock panels to
  // return to their origin rail.
  onDock?: () => void;
  // Drag lifecycle for snap-zone integration. Each receives the panel's
  // current bounding rect in viewport coordinates.
  onDragStart?: (rect: DOMRect) => void;
  onDrag?: (rect: DOMRect) => void;
  onDragEnd?: (rect: DOMRect) => void;
  // Extra controls rendered between title and the dock/close buttons
  // (e.g. LootWindow's "Clear" action).
  headerExtras?: ReactNode;
  bodyClassName?: string;
  className?: string;
  children: ReactNode;
};

// Reads the persisted size if any, else falls back to the component
// default, then clamps to the current viewport so a window saved on a
// larger monitor doesn't exceed the visible area.
function loadInitialSize(id: string, fallback: WindowSize, min: WindowSize): WindowSize {
  const saved = localPrefs.windowSize(id);
  const w0 = saved?.w ?? fallback.w;
  const h0 = saved?.h ?? fallback.h;
  return {
    w: Math.max(min.w, Math.min(w0, window.innerWidth)),
    h: Math.max(min.h, Math.min(h0, window.innerHeight)),
  };
}

export function FloatingWindow({
  id,
  title,
  defaultSize,
  minSize = DEFAULT_MIN_SIZE,
  onClose,
  onDock,
  onDragStart,
  onDrag,
  onDragEnd,
  headerExtras,
  bodyClassName = '',
  className = '',
  children,
}: FloatingWindowProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  // Position is an offset from CSS-centered (translate(-50%,-50%)). The
  // {0,0} initial keeps the box perfectly centered on first open and
  // matches the persistence format used by all existing floating windows.
  // Controlled mode: pos is updated on every onDrag so the parent's
  // continuous re-renders (driven by the store tick) don't snap the
  // box back to a stale value mid-drag.
  const [pos, setPos] = useState(() => localPrefs.windowPos(id));
  const [size, setSize] = useState<WindowSize>(() =>
    loadInitialSize(id, defaultSize, minSize),
  );

  const emitRect = useCallback(
    (cb?: (rect: DOMRect) => void) => {
      if (!cb || !nodeRef.current) return;
      cb(nodeRef.current.getBoundingClientRect());
    },
    [],
  );

  const handleDragStart = (_e: DraggableEvent, data: DraggableData) => {
    setPos({ x: data.x, y: data.y });
    emitRect(onDragStart);
  };
  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    setPos({ x: data.x, y: data.y });
    emitRect(onDrag);
  };
  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    const next = { x: data.x, y: data.y };
    setPos(next);
    localPrefs.setWindowPos(id, next);
    emitRect(onDragEnd);
  };

  // SE-corner resize. Captures starting cursor + size, then grows the box
  // on mousemove. The box grows symmetrically around its (translate-50%)
  // origin — under the centered-offset positioning this is the simplest
  // behavior that works without fighting react-draggable's internal
  // transform.
  const resizeStateRef = useRef<{ x0: number; y0: number; w0: number; h0: number } | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const s = resizeStateRef.current;
      if (!s) return;
      e.preventDefault();
      const dx = e.clientX - s.x0;
      const dy = e.clientY - s.y0;
      setSize({
        w: Math.max(minSize.w, s.w0 + dx),
        h: Math.max(minSize.h, s.h0 + dy),
      });
    };
    const onUp = () => {
      const s = resizeStateRef.current;
      if (!s) return;
      resizeStateRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      // Persist the latest committed size. Reading it via the React state
      // setter keeps us off stale-closure values without forcing a
      // re-render (returning the same reference is React's bail-out path).
      setSize((curSize) => {
        localPrefs.setWindowSize(id, curSize);
        return curSize;
      });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [id, minSize.w, minSize.h]);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizeStateRef.current = {
      x0: e.clientX,
      y0: e.clientY,
      w0: size.w,
      h0: size.h,
    };
    document.body.style.cursor = 'se-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".fw-drag-handle"
      cancel=".fw-no-drag"
      position={pos}
      onStart={handleDragStart}
      onDrag={handleDrag}
      onStop={handleDragStop}
    >
      <div
        ref={nodeRef}
        data-fw-id={id}
        style={{ width: size.w, height: size.h }}
        className={`fixed left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col rounded border border-border bg-bg-panel shadow-xl ${className}`}
      >
        <header className="fw-drag-handle flex shrink-0 cursor-move select-none items-center justify-between border-b border-border bg-bg-alt px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-foreground">
          <span className="truncate">{title}</span>
          <div className="fw-no-drag flex items-center gap-1">
            {headerExtras}
            {onDock && (
              <button
                type="button"
                onClick={onDock}
                aria-label="Dock window"
                title="Dock"
                className="rounded px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-bg-base hover:text-foreground"
              >
                ↘
              </button>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close window"
                className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-bg-base hover:text-foreground"
              >
                ×
              </button>
            )}
          </div>
        </header>
        <div className={`flex min-h-0 flex-1 flex-col overflow-hidden ${bodyClassName}`}>
          {children}
        </div>
        <div
          onMouseDown={startResize}
          aria-hidden
          className="absolute bottom-0 right-0 h-3.5 w-3.5 cursor-se-resize text-muted-foreground hover:text-foreground"
          style={{
            backgroundImage:
              'linear-gradient(135deg, transparent 0 55%, currentColor 55% 65%, transparent 65% 75%, currentColor 75% 85%, transparent 85%)',
          }}
        />
      </div>
    </Draggable>
  );
}
