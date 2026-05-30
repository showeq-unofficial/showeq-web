import { useEffect, useRef } from 'react';

// Divider between a rail and the map. Dragging the bar resizes the rail
// (same window-bound drag as ResizeHandle, so it keeps working if the cursor
// leaves the 4px target); clicking the centered chevron collapses the whole
// rail. The chevron stops pointer propagation so a click collapses instead
// of starting a resize drag.
export function RailDivider({
  side,
  onResize,
  onCollapse,
}: {
  side: 'left' | 'right';
  onResize: (dx: number) => void;
  onCollapse: () => void;
}) {
  const lastXRef = useRef<number | null>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (lastXRef.current === null) return;
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      if (dx !== 0) onResize(dx);
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
  }, [onResize]);

  // Left rail collapses toward the left edge (chevron ‹); right rail toward
  // the right edge (›).
  const chevron = side === 'left' ? '‹' : '›';

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
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={onCollapse}
        aria-label={`Collapse ${side} panel`}
        title={`Collapse ${side} panel`}
        className="absolute left-1/2 top-1/2 z-10 flex h-8 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded border border-border bg-bg-panel text-[11px] leading-none text-muted-foreground opacity-70 hover:bg-bg-base hover:text-foreground hover:opacity-100"
      >
        {chevron}
      </button>
    </div>
  );
}

// Thin strip shown in place of a collapsed rail. The whole strip is the
// reopen affordance; it lists the docked panel titles vertically so the user
// knows what's behind it.
export function CollapsedRail({
  side,
  labels,
  onExpand,
}: {
  side: 'left' | 'right';
  labels: string[];
  onExpand: () => void;
}) {
  const chevron = side === 'left' ? '›' : '‹';
  const border = side === 'left' ? 'border-r' : 'border-l';
  return (
    <button
      type="button"
      onClick={onExpand}
      aria-label={`Expand ${side} panel`}
      title={`Expand ${side} panel${labels.length ? ` (${labels.join(', ')})` : ''}`}
      className={`flex w-7 shrink-0 flex-col items-center gap-2 ${border} border-border bg-bg-panel py-2 text-muted-foreground transition-colors hover:bg-bg-base hover:text-foreground`}
    >
      <span className="text-xs leading-none">{chevron}</span>
      <span className="select-none whitespace-nowrap text-[11px] tracking-wide [writing-mode:vertical-rl]">
        {labels.join('  ·  ')}
      </span>
    </button>
  );
}
