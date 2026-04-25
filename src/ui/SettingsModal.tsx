import { useEffect } from 'react';

// Generic modal shell. The body is provided by callers — this layer
// only owns the chrome (backdrop, centered panel, close affordances).
// Esc + backdrop click both close. Body click does not propagate.
export function SettingsModal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="flex h-[80vh] w-[min(900px,90vw)] flex-col overflow-hidden rounded-md border border-neutral-700 bg-bg-panel shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-neutral-800 px-3 py-2">
          <h2 className="text-sm font-semibold text-neutral-200">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="rounded px-2 py-0.5 text-neutral-400 hover:bg-bg-base hover:text-neutral-200"
          >
            ✕
          </button>
        </header>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
