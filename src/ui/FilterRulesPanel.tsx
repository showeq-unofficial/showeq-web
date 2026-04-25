import { useMemo, useState } from 'react';
import type { SeqClient } from '../net/client';
import type { SpawnStore } from '../state/store';
import { FILTERS, tintForFilterFlags } from './filterflags';

// Filter rule editor. Lists current rules grouped by FilterMgr type
// (Hunt / Caution / ...) and provides a single add row per group plus
// a remove button on each existing rule. Mutations go through SeqClient
// — daemon broadcasts a refreshed FilterRulesUpdate to every connected
// client on success, so this panel stays consistent across tabs.

const FILTER_LABELS: Record<number, string> = (() => {
  // FILTERS[i] has { bit, label }; the daemon uses the index 0..6 as
  // the wire `filter_type`, not the bit value.
  const out: Record<number, string> = {};
  FILTERS.forEach((f, i) => { out[i] = f.label; });
  return out;
})();

const FILTER_TYPE_IDS = FILTERS.map((_, i) => i);

export function FilterRulesPanel({
  store,
  client,
  tick,
}: {
  store: SpawnStore;
  client: SeqClient;
  tick: number;
}) {
  void tick;
  const [perZone, setPerZone] = useState(false);

  const rulesByType = useMemo(() => {
    const out = new Map<number, { pattern: string; perZone: boolean }[]>();
    for (const id of FILTER_TYPE_IDS) out.set(id, []);
    const update = store.filterRulesState();
    if (update) {
      for (const r of update.rules) {
        const arr = out.get(r.filterType);
        if (!arr) continue;
        arr.push({ pattern: r.pattern, perZone: r.perZone });
      }
    }
    return out;
  }, [store, tick]);

  return (
    <div className="flex flex-col gap-2 px-2 py-2 text-xs">
      <label className="flex items-center gap-2 text-[11px] text-neutral-400">
        <input
          type="checkbox"
          checked={perZone}
          onChange={(e) => setPerZone(e.target.checked)}
          className="h-3 w-3 accent-blue-500"
        />
        Edit per-zone rules
        <span className="text-neutral-600">
          ({perZone ? 'overlay for current zone only' : 'global'})
        </span>
      </label>
      {FILTER_TYPE_IDS.map((typeId) => (
        <FilterTypeBlock
          key={typeId}
          label={FILTER_LABELS[typeId]}
          typeId={typeId}
          rules={rulesByType.get(typeId) ?? []}
          perZone={perZone}
          client={client}
        />
      ))}
    </div>
  );
}

function FilterTypeBlock({
  label,
  typeId,
  rules,
  perZone,
  client,
}: {
  label: string;
  typeId: number;
  rules: { pattern: string; perZone: boolean }[];
  perZone: boolean;
  client: SeqClient;
}) {
  const [draft, setDraft] = useState('');

  const visible = rules.filter((r) => r.perZone === perZone);
  // Show the same tint the spawn list uses for this filter type, so
  // users can map header → row color at a glance. Empty for
  // Filtered/Tracer (no tint by design).
  const tint = tintForFilterFlags(1 << typeId);

  const onAdd = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    client.addFilterRule(typeId, trimmed, perZone);
    setDraft('');
  };

  const onRemove = (pattern: string) => {
    client.removeFilterRule(typeId, pattern, perZone);
  };

  return (
    <section className="rounded border border-neutral-800 bg-bg-panel/60">
      <header className="flex items-baseline justify-between border-b border-neutral-800 px-2 py-1 text-[11px] uppercase tracking-wide text-neutral-300">
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            className={
              'inline-block h-2.5 w-2.5 rounded-sm border border-neutral-700 ' +
              (tint || 'bg-neutral-800')
            }
          />
          {label}
        </span>
        <span className="text-neutral-500">
          {visible.length} rule{visible.length === 1 ? '' : 's'}
        </span>
      </header>
      <ul className="flex flex-col">
        {visible.length === 0 ? (
          <li className="px-2 py-1 text-[11px] italic text-neutral-600">
            (no rules)
          </li>
        ) : (
          visible.map((r) => (
            <li
              key={r.pattern}
              className="flex items-center gap-2 border-b border-neutral-900 px-2 py-0.5 last:border-b-0"
            >
              <code className="flex-1 truncate font-mono text-[11px] text-neutral-200">
                {r.pattern}
              </code>
              <button
                type="button"
                onClick={() => onRemove(r.pattern)}
                title="Remove rule"
                className="rounded px-1 text-[10px] text-neutral-500 hover:bg-bg-base hover:text-red-400"
              >
                ×
              </button>
            </li>
          ))
        )}
      </ul>
      <div className="flex items-center gap-1 border-t border-neutral-800 px-2 py-1">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); onAdd(); }
          }}
          placeholder="pattern (e.g. Name:1-50)"
          spellCheck={false}
          className="flex-1 rounded border border-neutral-700 bg-bg-base px-1 py-0.5 font-mono text-[11px] text-neutral-200 placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={onAdd}
          className="rounded border border-neutral-700 bg-bg-alt px-1.5 py-0.5 text-[10px] text-neutral-300 hover:bg-bg-base"
        >
          add
        </button>
      </div>
    </section>
  );
}
