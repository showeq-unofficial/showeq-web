import type { RefObject } from 'react';

export type SnapSide = 'left' | 'right';
export type SnapHint = { side: SnapSide; slot: number };

// Translucent overlays drawn on the rails while a floating dock panel is
// being dragged. The overlay highlights when the drag rect is within the
// snap threshold so the user can see where the panel will land on
// release. Rendered absolutely over the rail bounds — no layout impact.
//
// `hint.slot` (when set) draws an insertion line at the rail's slot
// boundary so the user sees exactly where the panel will land
// vertically — between panels for slot in the middle, at top for 0,
// at bottom for end.
export function SnapZones({
  leftRailRef,
  rightRailRef,
  hint,
}: {
  leftRailRef: RefObject<HTMLDivElement | null>;
  rightRailRef: RefObject<HTMLDivElement | null>;
  hint: SnapHint | null;
}) {
  return (
    <>
      <RailOverlay railRef={leftRailRef} hint={hint?.side === 'left' ? hint : null} fallbackSide="left" />
      <RailOverlay railRef={rightRailRef} hint={hint?.side === 'right' ? hint : null} fallbackSide="right" />
    </>
  );
}

function RailOverlay({
  railRef,
  hint,
  fallbackSide,
}: {
  railRef: RefObject<HTMLDivElement | null>;
  hint: SnapHint | null;
  fallbackSide: SnapSide;
}) {
  const railEl = railRef.current;
  const rect = railEl?.getBoundingClientRect();
  const active = hint != null;
  const overlayStyle: React.CSSProperties = rect
    ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
    : fallbackSide === 'left'
    ? { left: 0, top: 0, width: 48, height: '100vh' }
    : { right: 0, top: 0, width: 48, height: '100vh' };

  // Insertion line: positioned at the top of slot N's panel (or just
  // below the last panel when slot === count). Only shown when hinting
  // this rail AND the rail is currently rendered.
  let lineStyle: React.CSSProperties | null = null;
  if (active && rect && railEl) {
    const sections = [...railEl.querySelectorAll<HTMLElement>(':scope > section')];
    let y: number;
    if (sections.length === 0) {
      y = rect.top + 4;
    } else if (hint!.slot >= sections.length) {
      const last = sections[sections.length - 1].getBoundingClientRect();
      y = last.bottom - 1;
    } else {
      const target = sections[hint!.slot].getBoundingClientRect();
      y = target.top - 1;
    }
    lineStyle = { left: rect.left, top: y, width: rect.width, height: 3 };
  }

  return (
    <>
      <div
        aria-hidden
        className={`pointer-events-none fixed z-40 border-2 transition-colors ${
          active ? 'border-primary bg-primary/20' : 'border-primary/40 bg-primary/5'
        }`}
        style={overlayStyle}
      />
      {lineStyle && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-40 bg-primary"
          style={lineStyle}
        />
      )}
    </>
  );
}
