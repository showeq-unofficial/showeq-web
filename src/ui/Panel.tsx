import type { ReactNode } from 'react';

// Standard chrome around a side-rail panel: a header strip with the
// title + close (hide) button, and the body. Body grows to fill the
// remaining height when the panel is in a flex column.
export function Panel({
  title,
  onClose,
  children,
  className = '',
  bodyClassName = '',
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`flex min-h-0 flex-col border-b border-neutral-800 bg-bg-panel ${className}`}>
      <header className="flex shrink-0 items-center justify-between border-b border-neutral-800 bg-bg-alt px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-neutral-300">
        <span>{title}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Hide ${title}`}
          className="rounded px-1 text-neutral-400 hover:bg-bg-base hover:text-neutral-200"
        >
          ×
        </button>
      </header>
      <div className={`flex min-h-0 flex-1 flex-col ${bodyClassName}`}>
        {children}
      </div>
    </section>
  );
}
