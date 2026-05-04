import { FloatingWindow } from './FloatingWindow';
import type { SpawnStore } from '../state/store';

// AA-id → human label mapping is OP_SendAATable territory (not in proto today),
// so v1 just shows the numeric ability_id. Sorted by id ascending — no
// stable name-order yet. Once OP_SendAATable record contents are surfaced,
// swap the id for the title_sid lookup.
export function AAWindow({
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
  const rows = [...(stats?.purchasedAa ?? [])].sort(
    (a, b) => a.abilityId - b.abilityId,
  );
  const totalRanks = rows.reduce((sum, r) => sum + r.rank, 0);

  return (
    <FloatingWindow
      id="aa"
      title={`AAs (${rows.length} · ${totalRanks} ranks)`}
      defaultSize={{ w: 280, h: 360 }}
      onClose={onClose}
    >
        <div className="flex-1 overflow-y-auto px-2 py-1">
          {rows.length === 0 ? (
            <div className="py-2 text-center text-xs text-muted-foreground">
              No AAs purchased yet
            </div>
          ) : (
            <table className="w-full text-xs">
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.abilityId}
                    className="border-b border-border/40 last:border-0"
                  >
                    <td className="py-0.5 font-mono text-foreground">
                      #{r.abilityId}
                    </td>
                    <td className="py-0.5 text-right font-mono text-amber-500">
                      {r.rank}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
    </FloatingWindow>
  );
}
