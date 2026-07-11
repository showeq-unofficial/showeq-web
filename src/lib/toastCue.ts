import { toast } from 'sonner';
import { useAlertsStore, type FilterCueKey } from '@/state/alertsStore';

// Thin wrapper over sonner that centralizes toast styling + gating so
// callers (App's spawn-alert subscriber, the buff-warning hook) stay
// clean. Parallels audioCue.ts's public API. Gated only by the master
// `toastsEnabled` toggle — deliberately independent of audio mute so a
// user can keep silent visual alerts.
//
// Severity → sonner variant (richColors is enabled on the <Toaster/>):
//   danger  → error   (red)
//   caution → warning (amber)
//   else    → info    (blue)
// which mirrors the spawn-list row tints.

const CUE_LABEL: Record<FilterCueKey, string> = {
  hunt:     'Hunt',
  caution:  'Caution',
  danger:   'Danger',
  locate:   'Locate',
  alert:    'Alert',
  filtered: 'Filtered',
  tracer:   'Tracer',
};

function enabled(): boolean {
  return useAlertsStore.getState().toastsEnabled;
}

// Toast for a filter-flagged spawn. `spawnId` (when known) gives the
// toast a stable id so a re-add of the same spawn replaces rather than
// stacks.
export function toastSpawnAlert(spawnName: string, cue: FilterCueKey, spawnId?: number): void {
  if (!enabled()) return;
  const opts = {
    description: CUE_LABEL[cue],
    id: spawnId != null ? `spawn-${spawnId}` : `spawn-${spawnName}`,
  };
  const name = spawnName || 'Unknown spawn';
  if (cue === 'danger') toast.error(name, opts);
  else if (cue === 'caution') toast.warning(name, opts);
  else toast.info(name, opts);
}

// Toast for a buff crossing its fade threshold. Stable id per spellId so
// a rapid re-fire (recast) replaces the existing toast.
export function toastBuffFading(spellName: string, remainingSecs: number, spellId: number): void {
  if (!enabled()) return;
  toast.warning(`${spellName} is fading`, {
    description: `~${Math.max(0, Math.round(remainingSecs))}s left`,
    id: `buff-fade-${spellId}`,
  });
}
