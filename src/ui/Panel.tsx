import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react';

// Standard chrome around a side-rail panel: a header strip with the
// title + close (hide) button, and the body. Body grows to fill the
// remaining height when the panel is in a flex column.
//
// `onDetach` adds a "↗" button that pops the panel out as a floating
// window; `onHeaderPointerDown` lets the parent wire a drag-out gesture
// (parent watches pointermove with a movement threshold and detaches
// when the threshold trips).
export function Panel({
  title,
  onClose,
  onDetach,
  onHeaderPointerDown,
  children,
  className = '',
  bodyClassName = '',
  style,
}: {
  title: string;
  onClose: () => void;
  onDetach?: (e: ReactMouseEvent<HTMLButtonElement>) => void;
  onHeaderPointerDown?: (e: ReactPointerEvent<HTMLElement>) => void;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  style?: CSSProperties;
}) {
  return (
    <section style={style} className={`flex min-h-0 flex-col border-b border-border bg-bg-panel ${className}`}>
      <header
        onPointerDown={onHeaderPointerDown}
        className={`flex shrink-0 select-none items-center justify-between border-b border-border bg-bg-alt px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-foreground ${onHeaderPointerDown ? 'cursor-grab' : ''}`}
      >
        <span className="truncate">{title}</span>
        <div className="flex items-center gap-0.5">
          {onDetach && (
            <button
              type="button"
              onClick={onDetach}
              aria-label={`Detach ${title}`}
              title="Detach"
              className="rounded px-1 text-muted-foreground hover:bg-bg-base hover:text-foreground"
            >
              ↗
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label={`Hide ${title}`}
            className="rounded px-1 text-muted-foreground hover:bg-bg-base hover:text-foreground"
          >
            ×
          </button>
        </div>
      </header>
      <div className={`flex min-h-0 flex-1 flex-col ${bodyClassName}`}>
        {children}
      </div>
    </section>
  );
}
