import { useEffect, useMemo, useRef, useState } from 'react';
import type { SeqClient } from '../net/client';
import type { SpawnStore } from '../state/store';
import { FILTERS, swatchForFilterTypeId } from './filterflags';

// Filter rule editor. Master/detail layout: left rail lists the 7 filter
// types with rule counts; right pane shows the focused type's rules and
// the add row. Search filters across all types (left rail counts update
// to reflect matches). Reload button re-reads the XML files on the
// daemon — useful after the operator edits filters outside the daemon.
// Mutations and reloads go through SeqClient; the daemon broadcasts a
// fresh FilterRulesUpdate on success so the panel stays consistent
// across tabs.

const FILTER_TYPE_IDS = FILTERS.map((_, i) => i);

const STORAGE_SELECTED = 'filterPanel.selectedType';
const STORAGE_ADD_SCOPE = 'filterPanel.addScope';

type Rule = {
  pattern: string;
  perZone: boolean;
  minLevel: number;
  maxLevel: number;
};

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
  const currentZone = store.zone();

  const [selectedType, setSelectedType] = useState<number>(() => {
    const v = Number(localStorage.getItem(STORAGE_SELECTED) ?? '0');
    return Number.isFinite(v) && v >= 0 && v < FILTERS.length ? v : 0;
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_SELECTED, String(selectedType));
  }, [selectedType]);

  const rulesByType = useMemo(() => {
    const out = new Map<number, Rule[]>();
    for (const id of FILTER_TYPE_IDS) out.set(id, []);
    const update = store.filterRulesState();
    if (update) {
      for (const r of update.rules) {
        const arr = out.get(r.filterType);
        if (!arr) continue;
        arr.push({
          pattern: r.pattern,
          perZone: r.perZone,
          minLevel: r.minLevel,
          maxLevel: r.maxLevel,
        });
      }
    }
    return out;
  }, [store, tick]);

  const searchLc = search.trim().toLowerCase();
  const matchesSearch = (r: Rule) =>
    !searchLc || r.pattern.toLowerCase().includes(searchLc);

  const selectedRules = rulesByType.get(selectedType) ?? [];
  const filteredRules = selectedRules.filter(matchesSearch);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-neutral-800 px-3 py-2 text-xs">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patterns…"
          spellCheck={false}
          className="flex-1 rounded border border-neutral-700 bg-bg-base px-2 py-1 font-mono text-[11px] text-neutral-200 placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none"
        />
        <DiskMenu client={client} currentZone={currentZone} />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <ul className="flex w-[200px] flex-col border-r border-neutral-800 bg-bg-panel/40 py-1 text-xs">
          {FILTER_TYPE_IDS.map((id) => {
            const swatch = swatchForFilterTypeId(id);
            const isSelected = id === selectedType;
            const total = (rulesByType.get(id) ?? []).length;
            const visible = (rulesByType.get(id) ?? []).filter(matchesSearch).length;
            const showFraction = !!searchLc && visible !== total;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setSelectedType(id)}
                  className={
                    'flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left ' +
                    (isSelected
                      ? 'bg-bg-base text-neutral-100'
                      : 'text-neutral-300 hover:bg-bg-base/60')
                  }
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className={
                        'inline-block h-2.5 w-2.5 rounded-sm border border-neutral-600 ' +
                        swatch
                      }
                    />
                    {FILTERS[id].label}
                  </span>
                  <span
                    className={
                      'rounded px-1.5 text-[10px] tabular-nums ' +
                      (showFraction
                        ? 'bg-blue-900/50 text-blue-200'
                        : total === 0
                          ? 'text-neutral-600'
                          : 'bg-neutral-800 text-neutral-300')
                    }
                  >
                    {showFraction ? `${visible}/${total}` : total}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <RulePane
          typeId={selectedType}
          rules={filteredRules}
          totalRules={selectedRules.length}
          searchActive={!!searchLc}
          currentZone={currentZone}
          client={client}
        />
      </div>
    </div>
  );
}

function RulePane({
  typeId,
  rules,
  totalRules,
  searchActive,
  currentZone,
  client,
}: {
  typeId: number;
  rules: Rule[];
  totalRules: number;
  searchActive: boolean;
  currentZone: string;
  client: SeqClient;
}) {
  const [draft, setDraft] = useState('');
  const [scope, setScope] = useState<'global' | 'zone'>(() => {
    const v = localStorage.getItem(STORAGE_ADD_SCOPE);
    return v === 'zone' ? 'zone' : 'global';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_ADD_SCOPE, scope);
  }, [scope]);

  // No zone loaded → can't author a per-zone rule, so the input
  // always submits as global regardless of the (disabled) toggle.
  const effectiveScope: 'global' | 'zone' = !currentZone ? 'global' : scope;

  const onAdd = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    client.addFilterRule(typeId, trimmed, effectiveScope === 'zone');
    setDraft('');
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex items-baseline gap-2 border-b border-neutral-800 px-3 py-1.5 text-[11px] uppercase tracking-wide">
        <span
          aria-hidden
          className={
            'inline-block h-2.5 w-2.5 rounded-sm border border-neutral-600 ' +
            swatchForFilterTypeId(typeId)
          }
        />
        <span className="text-neutral-200">{FILTERS[typeId].label}</span>
        <span className="text-neutral-600">·</span>
        <span className="normal-case tracking-normal text-neutral-500">
          {rules.length} rule{rules.length === 1 ? '' : 's'}
          {searchActive && rules.length !== totalRules
            ? ` (of ${totalRules})`
            : ''}
        </span>
      </header>
      <ul className="flex-1 overflow-auto">
        {rules.length === 0 ? (
          <li className="px-3 py-3 text-[11px] italic text-neutral-600">
            {searchActive
              ? '(no patterns match the search)'
              : '(no rules — add one below)'}
          </li>
        ) : (
          rules.map((r) => (
            <RuleRow
              key={`${r.perZone ? 'z' : 'g'}::${r.pattern}`}
              typeId={typeId}
              rule={r}
              currentZone={currentZone}
              client={client}
            />
          ))
        )}
      </ul>
      <div className="flex flex-col gap-1 border-t border-neutral-800 bg-bg-panel/40 px-3 py-2">
        <div className="flex items-center gap-1">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAdd();
              }
            }}
            placeholder="pattern (e.g. Name:1-50)"
            spellCheck={false}
            className="flex-1 rounded border border-neutral-700 bg-bg-base px-2 py-1 font-mono text-[11px] text-neutral-200 placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={onAdd}
            className="rounded border border-neutral-700 bg-bg-alt px-2 py-1 text-[11px] text-neutral-300 hover:bg-bg-base"
          >
            + add
          </button>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-neutral-400">
          <span>scope:</span>
          <SegmentedScope
            value={effectiveScope}
            onChange={setScope}
            zoneName={currentZone}
          />
        </div>
      </div>
    </div>
  );
}

function DiskMenu({
  client,
  currentZone,
}: {
  client: SeqClient;
  currentZone: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const run = (fn: () => void) => {
    fn();
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded border border-neutral-700 bg-bg-alt px-2 py-1 text-[11px] text-neutral-300 hover:bg-bg-base"
      >
        Disk ▾
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-1 min-w-[200px] overflow-hidden rounded border border-neutral-700 bg-bg-panel text-[11px] shadow-lg"
        >
          <MenuItem
            label="↻ Reload from disk"
            hint="Re-read filter XML on the daemon"
            onClick={() => run(() => client.reloadFilters())}
          />
          <MenuDivider />
          <MenuItem
            label="💾 Save global"
            hint="Write filters/global.xml"
            onClick={() => run(() => client.saveFilters(false))}
          />
          <MenuItem
            label={`💾 Save zone${currentZone ? `: ${currentZone}` : ''}`}
            hint={
              currentZone
                ? `Write filters/${currentZone}.xml`
                : 'No zone loaded'
            }
            disabled={!currentZone}
            onClick={() => run(() => client.saveFilters(true))}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  label,
  hint,
  disabled,
  onClick,
}: {
  label: string;
  hint?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      title={hint}
      className={
        'flex w-full items-center px-3 py-1.5 text-left ' +
        (disabled
          ? 'cursor-not-allowed text-neutral-600'
          : 'text-neutral-200 hover:bg-bg-base')
      }
    >
      {label}
    </button>
  );
}

function MenuDivider() {
  return <div aria-hidden className="border-t border-neutral-800" />;
}

function RuleRow({
  typeId,
  rule,
  currentZone,
  client,
}: {
  typeId: number;
  rule: Rule;
  currentZone: string;
  client: SeqClient;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(rule.pattern);

  // Reset draft if the rule changes underneath us (another tab edited it).
  useEffect(() => {
    if (!editing) setDraft(rule.pattern);
  }, [rule.pattern, editing]);

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === rule.pattern) {
      setDraft(rule.pattern);
      setEditing(false);
      return;
    }
    client.editFilterRule(typeId, rule.pattern, trimmed, rule.perZone);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(rule.pattern);
    setEditing(false);
  };

  return (
    <li className="flex items-center gap-2 border-b border-neutral-900 px-3 py-1 last:border-b-0">
      <ScopeBadge perZone={rule.perZone} zoneName={currentZone} />
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              cancel();
            }
          }}
          spellCheck={false}
          className="flex-1 rounded border border-blue-500 bg-bg-base px-1 py-0.5 font-mono text-[11px] text-neutral-100 focus:outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          title="Click to edit"
          className="flex-1 truncate text-left font-mono text-[11px] text-neutral-200 hover:text-neutral-50"
        >
          {rule.pattern}
        </button>
      )}
      <button
        type="button"
        onClick={() => client.removeFilterRule(typeId, rule.pattern, rule.perZone)}
        title="Remove rule"
        className="rounded px-1.5 text-[10px] text-neutral-500 hover:bg-bg-base hover:text-red-400"
      >
        ×
      </button>
    </li>
  );
}

function ScopeBadge({
  perZone,
  zoneName,
}: {
  perZone: boolean;
  zoneName: string;
}) {
  if (perZone) {
    return (
      <span
        className="rounded bg-blue-900/40 px-1 py-px text-[9px] uppercase tracking-wide text-blue-200"
        title={`Per-zone rule for ${zoneName || 'current zone'}`}
      >
        {zoneName || 'zone'}
      </span>
    );
  }
  return (
    <span
      className="rounded bg-neutral-800 px-1 py-px text-[9px] uppercase tracking-wide text-neutral-400"
      title="Global rule (applies in every zone)"
    >
      global
    </span>
  );
}

function SegmentedScope({
  value,
  onChange,
  zoneName,
}: {
  value: 'global' | 'zone';
  onChange: (v: 'global' | 'zone') => void;
  zoneName: string;
}) {
  const zoneDisabled = !zoneName;
  return (
    <div className="inline-flex overflow-hidden rounded border border-neutral-700 text-[10px]">
      <button
        type="button"
        onClick={() => onChange('global')}
        className={
          'px-2 py-0.5 ' +
          (value === 'global'
            ? 'bg-bg-base text-neutral-100'
            : 'bg-bg-panel/40 text-neutral-400 hover:bg-bg-base/60')
        }
      >
        Global
      </button>
      <button
        type="button"
        disabled={zoneDisabled}
        onClick={() => !zoneDisabled && onChange('zone')}
        title={
          zoneDisabled ? 'No zone loaded' : `Apply only in ${zoneName}`
        }
        className={
          'border-l border-neutral-700 px-2 py-0.5 ' +
          (zoneDisabled
            ? 'cursor-not-allowed bg-bg-panel/20 text-neutral-700'
            : value === 'zone'
              ? 'bg-bg-base text-neutral-100'
              : 'bg-bg-panel/40 text-neutral-400 hover:bg-bg-base/60')
        }
      >
        Zone: {zoneName || '(none)'}
      </button>
    </div>
  );
}
