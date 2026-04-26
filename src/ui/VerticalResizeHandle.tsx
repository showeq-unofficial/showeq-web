import { useEffect, useRef } from 'react';

// Horizontal drag handle for splitting two stacked panels. Mirrors the
// existing ResizeHandle (which sits between rails on the X axis); this
// one drags vertically and emits a per-move dy.
export function VerticalResizeHandle({ onDrag }: { onDrag: (dy: number) => void }) {
  const lastYRef = useRef<number | null>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (lastYRef.current === null) return;
      const dy = e.clientY - lastYRef.current;
      lastYRef.current = e.clientY;
      if (dy !== 0) onDrag(dy);
    };
    const onMouseUp = () => {
      if (lastYRef.current === null) return;
      lastYRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onDrag]);

  return (
    <div
      onMouseDown={(e) => {
        e.preventDefault();
        lastYRef.current = e.clientY;
        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';
      }}
      role="separator"
      aria-orientation="horizontal"
      className="relative h-1 shrink-0 cursor-row-resize bg-neutral-800 transition-colors hover:bg-blue-600"
    >
      {/* Wider invisible hit-area so the user doesn't have to land on
          a 4px target precisely. */}
      <div className="absolute inset-x-0 -top-1 -bottom-1" />
    </div>
  );
}
