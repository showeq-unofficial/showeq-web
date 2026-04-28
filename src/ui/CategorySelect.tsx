import { useEffect, useRef, useState } from 'react';

export type CategoryOption = {
  id: number;        // -1 means "All"
  name: string;
  color?: string;    // "#rrggbb" — only honored on the swatch, not the text
};

// Custom dropdown: native <select> can't render a colored swatch beside
// neutral-color text within a single <option> reliably across browsers.
// This component keeps each option's swatch in the daemon-supplied color
// while the label stays in our dark-theme text color, sidestepping the
// invisible-on-dark problem.
export function CategorySelect({
  value,
  options,
  onChange,
}: {
  value: number;
  options: CategoryOption[];
  onChange: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.id === value)
    ?? { id: -1, name: 'All', color: undefined };

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded border border-border bg-bg-base px-1.5 py-0.5 text-xs text-foreground hover:border-border focus:border-blue-500 focus:outline-none"
      >
        <Swatch color={selected.color} />
        <span className="min-w-0 truncate">{selected.name}</span>
        <span className="text-[10px] text-muted-foreground">▾</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-10 mt-1 max-h-72 min-w-full overflow-y-auto rounded border border-border bg-bg-panel py-0.5 text-xs shadow-lg"
        >
          {options.map((o) => (
            <li
              key={o.id}
              role="option"
              aria-selected={o.id === value}
              onClick={() => {
                onChange(o.id);
                setOpen(false);
              }}
              className={
                'flex cursor-pointer items-center gap-1.5 whitespace-nowrap px-2 py-1 text-foreground ' +
                (o.id === value ? 'bg-blue-900/40' : 'hover:bg-bg-alt')
              }
            >
              <Swatch color={o.color} />
              <span>{o.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Swatch({ color }: { color?: string }) {
  // Always render the swatch slot at the same size so labels align even
  // when a category has no color (e.g. the "All" option).
  return (
    <span
      aria-hidden="true"
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm border border-border"
      style={{ background: color || 'transparent' }}
    />
  );
}
