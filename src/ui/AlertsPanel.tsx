import { Volume2, VolumeX } from 'lucide-react';
import { FILTERS } from './filterflags';
import {
  FILTER_CUE_KEYS,
  useAlertsStore,
  type FilterCueKey,
} from '@/state/alertsStore';
import { previewCue } from '@/lib/audioCue';

// Settings panel for spawn-alert and buff-fading sounds. Reads/writes
// `useAlertsStore`. Uses `previewCue` for the test buttons so the user
// can hear a cue regardless of its enabled/mute state — handy for
// auditioning before committing.
//
// Filtered/Tracer rows are present for completeness but the labels
// surface that they're hide/debug categories: they don't get a row tint
// in the spawn list either, so it would be surprising for them to be
// audibly notable.

const FILTER_DESCRIPTIONS: Record<FilterCueKey, string> = {
  hunt:     'Spawn matches a Hunt rule',
  caution:  'Spawn matches a Caution rule',
  danger:   'Spawn matches a Danger rule',
  locate:   'Spawn matches a Locate rule',
  alert:    'Spawn matches a generic Alert rule',
  filtered: 'Spawn matches a Filtered (hidden) rule',
  tracer:   'Spawn matches a Tracer (debug) rule',
};

export function AlertsPanel() {
  const muted = useAlertsStore((s) => s.muted);
  const masterVolume = useAlertsStore((s) => s.masterVolume);
  const filterCues = useAlertsStore((s) => s.filterCues);
  const buffWarning = useAlertsStore((s) => s.buffWarning);
  const buffWarningSecs = useAlertsStore((s) => s.buffWarningSecs);

  const setMuted = useAlertsStore((s) => s.setMuted);
  const setMasterVolume = useAlertsStore((s) => s.setMasterVolume);
  const setFilterCueEnabled = useAlertsStore((s) => s.setFilterCueEnabled);
  const setFilterCueVolume = useAlertsStore((s) => s.setFilterCueVolume);
  const setBuffWarningEnabled = useAlertsStore((s) => s.setBuffWarningEnabled);
  const setBuffWarningVolume = useAlertsStore((s) => s.setBuffWarningVolume);
  const setBuffWarningSecs = useAlertsStore((s) => s.setBuffWarningSecs);
  const resetAlerts = useAlertsStore((s) => s.resetAlerts);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 text-xs">
      <section className="flex flex-col gap-2">
        <label className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Master
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={muted ? 'Unmute alerts' : 'Mute alerts'}
            title={muted ? 'Unmute' : 'Mute'}
            onClick={() => setMuted(!muted)}
            className={
              'flex h-7 w-7 items-center justify-center rounded transition-colors ' +
              (muted
                ? 'bg-red-700 text-red-100 hover:bg-red-600'
                : 'bg-bg-base text-foreground hover:bg-bg-alt')
            }
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <span className="w-20 text-foreground">Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={masterVolume}
            onChange={(e) => setMasterVolume(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
          <span className="w-10 text-right font-mono text-[11px] text-muted-foreground">
            {Math.round(masterVolume * 100)}%
          </span>
        </div>
        <p className="text-muted-foreground">
          Master volume scales every cue. Mute disables both spawn and buff alerts.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <label className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Spawn alerts
          </label>
          <span className="text-[10px] text-muted-foreground">
            Plays once per spawn that matches a filter rule
          </span>
        </div>
        <div className="flex flex-col rounded border border-border bg-bg-base">
          {FILTERS.map((f, idx) => {
            const key = FILTER_CUE_KEYS[idx];
            if (!key) return null;
            const cue = filterCues[key];
            return (
              <div
                key={key}
                className="flex items-center gap-2 border-b border-border px-2 py-1.5 last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={cue.enabled}
                  onChange={(e) => setFilterCueEnabled(key, e.target.checked)}
                  className="accent-primary"
                />
                <span
                  aria-hidden="true"
                  className={`inline-block h-2.5 w-2.5 shrink-0 rounded-sm ${f.swatch}`}
                />
                <span className="w-20 text-foreground">{f.label}</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={cue.volume}
                  disabled={!cue.enabled}
                  onChange={(e) => setFilterCueVolume(key, Number(e.target.value))}
                  className="flex-1 accent-primary disabled:opacity-40"
                />
                <span className="w-10 text-right font-mono text-[11px] text-muted-foreground">
                  {Math.round(cue.volume * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => previewCue(key, cue.volume)}
                  className="rounded border border-border bg-bg-alt px-2 py-0.5 text-[10px] text-foreground hover:bg-bg-base"
                  title={FILTER_DESCRIPTIONS[key]}
                >
                  test
                </button>
              </div>
            );
          })}
        </div>
        <p className="text-muted-foreground">
          When a new spawn matches multiple rules, the highest-priority cue wins:
          Danger › Caution › Alert › Hunt › Locate. Edit rules in the Filters dialog.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <label className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Buff fading
        </label>
        <div className="flex items-center gap-2 rounded border border-border bg-bg-base px-2 py-1.5">
          <input
            type="checkbox"
            checked={buffWarning.enabled}
            onChange={(e) => setBuffWarningEnabled(e.target.checked)}
            className="accent-primary"
          />
          <span className="w-20 text-foreground">Warn at</span>
          <input
            type="number"
            min={5}
            max={300}
            step={1}
            value={buffWarningSecs}
            onChange={(e) => setBuffWarningSecs(Number(e.target.value))}
            className="w-16 rounded border border-border bg-bg-base px-2 py-0.5 font-mono text-[11px] text-foreground focus:border-ring focus:outline-none"
          />
          <span className="text-muted-foreground">sec remaining</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={buffWarning.volume}
            disabled={!buffWarning.enabled}
            onChange={(e) => setBuffWarningVolume(Number(e.target.value))}
            className="flex-1 accent-primary disabled:opacity-40"
          />
          <span className="w-10 text-right font-mono text-[11px] text-muted-foreground">
            {Math.round(buffWarning.volume * 100)}%
          </span>
          <button
            type="button"
            onClick={() => previewCue('buff-fading', buffWarning.volume)}
            className="rounded border border-border bg-bg-alt px-2 py-0.5 text-[10px] text-foreground hover:bg-bg-base"
          >
            test
          </button>
        </div>
        <p className="text-muted-foreground">
          Fires once per buff as it crosses the threshold downward. Re-casting
          a buff resets its warning so the next fade produces a fresh cue.
        </p>
      </section>

      <section className="flex justify-end">
        <button
          type="button"
          onClick={resetAlerts}
          className="rounded border border-border bg-bg-alt px-3 py-1 text-[11px] text-foreground hover:bg-bg-base"
        >
          Reset to defaults
        </button>
      </section>
    </div>
  );
}
