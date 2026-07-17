import { FloatingWindow } from './FloatingWindow';
import type { SpawnStore } from '../state/store';
import { findPrimarySpec, skillCap } from './skillCaps';
import { skillNameOf } from './skills';

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toTimeString().slice(0, 8);
}

export function SkillsWindow({
  store,
  tick,
  onClose,
}: {
  store: SpawnStore;
  tick: number;
  onClose: () => void;
}) {
  void tick;
  const stats = store.stats();
  const skills = stats?.skills ?? [];
  const classId = stats?.class ?? 0;
  const level = stats?.level ?? 0;
  // Look up cap per skill — undefined means the class can't train it,
  // so we drop the row. Live EQ doesn't store a "primary specialization"
  // flag in the profile; we infer it from whichever spec the player has
  // raised past the non-primary cap (135), then pass that into skillCap.
  const primarySpecId = findPrimarySpec(skills, classId, level);
  const rows = skills
    .map((s) => ({
      ...s,
      cap: skillCap(s.skillId, classId, level, primarySpecId),
    }))
    // Keep skills the class can train (known cap) OR any skill the player
    // actually has a value in — e.g. EQL skills 75-82, which have no cap
    // table yet; a trained skill is real even if its cap is unknown.
    .filter((s) => s.cap !== undefined || s.value > 0)
    .sort((a, b) => skillNameOf(a.skillId).localeCompare(skillNameOf(b.skillId)));
  // Newest first, capped at 5 visible. The store retains more history
  // for diffing — this is just the displayed slice.
  const log = [...store.skillLogEntries()].reverse().slice(0, 5);

  return (
    <FloatingWindow
      id="skills"
      title="Skills"
      defaultSize={{ w: 300, h: 420 }}
      onClose={onClose}
    >
        <div className="flex-1 overflow-y-auto px-2 py-1">
          {rows.length === 0 ? (
            <div className="py-2 text-center text-xs text-muted-foreground">
              No skills learned yet
            </div>
          ) : (
            <table className="w-full text-xs">
              <tbody>
                {rows.map((s) => {
                  const cap = s.cap;
                  const atCap = cap != null && cap > 0 && s.value >= cap;
                  return (
                    <tr key={s.skillId} className="border-b border-border/40 last:border-0">
                      <td className="py-0.5 text-foreground">{skillNameOf(s.skillId)}</td>
                      <td className={`py-0.5 text-right font-mono ${atCap ? 'text-amber-500' : 'text-foreground'}`}>
                        {s.value}{cap != null ? `/${cap}` : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="border-t border-border bg-bg-base/50 px-2 py-1">
          <div className="mb-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            Recent ({log.length})
          </div>
          <div className="max-h-24 overflow-y-auto font-mono text-[11px]">
            {log.length === 0 ? (
              <div className="text-muted-foreground">—</div>
            ) : (
              log.map((e, i) => (
                <div key={i} className="flex justify-between gap-2 leading-tight">
                  <span className="text-muted-foreground">{formatTime(e.localTs)}</span>
                  <span className="flex-1 truncate text-foreground">{skillNameOf(e.skillId)}</span>
                  <span className="text-amber-500">
                    {e.oldValue}→{e.newValue}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
    </FloatingWindow>
  );
}
