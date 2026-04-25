import { useEffect, useState } from 'react';
import type { SeqClient } from '../net/client';
import type { SpawnStore } from '../state/store';

// Preferences tab body. v1 only edits the chat-timestamp format string;
// new allowlisted prefs land here as they're added daemon-side. Each
// editor reads the current value from the store, lets the user edit
// locally, and on commit (Save / Enter) sends a SetPref. The daemon
// echoes a PrefChanged that re-syncs the store, so the UI converges
// even if multiple clients are editing.
export function PreferencesPanel({
  store,
  client,
  tick,
}: {
  store: SpawnStore;
  client: SeqClient | null;
  tick: number;
}) {
  void tick;
  const dtf = store.pref('Interface', 'DateTimeFormat');
  const dtfCurrent =
    dtf?.value.case === 'stringValue' ? dtf.value.value : '';

  const [dtfDraft, setDtfDraft] = useState(dtfCurrent);
  // Re-seed the draft whenever the daemon-side value changes (e.g. on
  // initial PrefsSnapshot, or when another client edits).
  useEffect(() => { setDtfDraft(dtfCurrent); }, [dtfCurrent]);

  const dirty = dtfDraft !== dtfCurrent;
  const commit = () => {
    if (!client || !dirty) return;
    client.setPref('Interface', 'DateTimeFormat', { stringValue: dtfDraft });
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-4 text-xs">
      <section className="flex flex-col gap-1">
        <label className="text-[11px] uppercase tracking-wide text-neutral-400">
          Chat timestamp format
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={dtfDraft}
            onChange={(e) => setDtfDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); commit(); }
              if (e.key === 'Escape') { setDtfDraft(dtfCurrent); }
            }}
            spellCheck={false}
            className="flex-1 rounded border border-neutral-700 bg-bg-base px-2 py-1 font-mono text-[11px] text-neutral-200 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={commit}
            disabled={!client || !dirty}
            className="rounded border border-neutral-700 bg-bg-alt px-2 py-1 text-[10px] text-neutral-300 hover:bg-bg-base disabled:cursor-not-allowed disabled:opacity-50"
          >
            save
          </button>
        </div>
        <p className="text-neutral-500">
          Qt date/time format string. Examples:{' '}
          <code className="text-neutral-400">ddd MMM dd,yyyy - hh:mm ap</code>{' '}
          • <code className="text-neutral-400">yyyy-MM-dd HH:mm:ss</code>.
          Saved daemon-side and shared across all connected clients.
        </p>
      </section>
    </div>
  );
}
