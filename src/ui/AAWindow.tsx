import { FloatingWindow } from './FloatingWindow';
import type { SpawnStore } from '../state/store';

// AAEntry.name is resolved daemon-side (OP_SendAATable descID->titleSID +
// dbstr_us.txt type-1); it's empty until that wire decode lands, so fall
// back to the numeric ability_id. Named rows sort alphabetically (matching
// legacy AAMgr::ownedRows); unnamed rows sort by id after them.
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
  const rows = [...(stats?.purchasedAa ?? [])].sort((a, b) => {
    if (a.name && b.name) return a.name.localeCompare(b.name);
    if (a.name) return -1;
    if (b.name) return 1;
    return a.abilityId - b.abilityId;
  });
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
                    <td className="py-0.5 text-foreground">
                      {r.name ? (
                        r.name
                      ) : (
                        <span className="font-mono">#{r.abilityId}</span>
                      )}
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
