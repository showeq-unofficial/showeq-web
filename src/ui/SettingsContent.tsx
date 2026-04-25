import { useState } from 'react';
import type { SeqClient } from '../net/client';
import type { SpawnStore } from '../state/store';
import { FilterRulesPanel } from './FilterRulesPanel';

type Tab = 'filters' | 'preferences';

const TABS: { id: Tab; label: string }[] = [
  { id: 'filters',     label: 'Filters'     },
  { id: 'preferences', label: 'Preferences' },
];

export function SettingsContent({
  store,
  client,
  tick,
}: {
  store: SpawnStore;
  client: SeqClient | null;
  tick: number;
}) {
  const [active, setActive] = useState<Tab>('filters');

  return (
    <div className="flex h-full min-h-0 flex-col">
      <nav
        role="tablist"
        className="flex shrink-0 gap-1 border-b border-neutral-800 bg-bg-alt/40 px-2"
      >
        {TABS.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(t.id)}
              className={
                '-mb-px border-b-2 px-3 py-2 text-xs transition-colors ' +
                (isActive
                  ? 'border-blue-500 text-neutral-100'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200')
              }
            >
              {t.label}
            </button>
          );
        })}
      </nav>
      <div className="min-h-0 flex-1 overflow-auto">
        {active === 'filters' && (
          client ? (
            <FilterRulesPanel store={store} client={client} tick={tick} />
          ) : (
            <div className="px-4 py-6 text-xs text-neutral-500">
              Connecting…
            </div>
          )
        )}
        {active === 'preferences' && (
          <div className="px-4 py-6 text-xs text-neutral-500">
            (Coming soon — global preferences will appear here.)
          </div>
        )}
      </div>
    </div>
  );
}
