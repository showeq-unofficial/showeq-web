import { useEffect, useRef } from 'react';

// Vertical drag handle. Emits the per-move cursor delta to the parent;
// parent integrates it into whatever width state it owns. Listeners bind
// to the window so dragging keeps working even if the cursor leaves the
// handle's bounds.
export function ResizeHandle({ onDrag }: { onDrag: (dx: number) => void }) {
  const lastXRef = useRef<number | null>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (lastXRef.current === null) return;
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      if (dx !== 0) onDrag(dx);
    };
    const onMouseUp = () => {
      if (lastXRef.current === null) return;
      lastXRef.current = null;
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
        lastXRef.current = e.clientX;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
      }}
      role="separator"
      aria-orientation="vertical"
      className="relative w-1 shrink-0 cursor-col-resize bg-border transition-colors hover:bg-primary"
    >
      {/* Wider invisible hit-area so the user doesn't have to hit a 4px
          target precisely. */}
      <div className="absolute inset-y-0 -left-1 -right-1" />
    </div>
  );
}
