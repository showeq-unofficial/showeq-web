import { FloatingWindow } from './FloatingWindow';
import type { SpawnStore } from '../state/store';
import { classNameOf } from './classes';
import { raceName } from '../lib/races';
import { equipSlotDisplay, slotLabel } from '../lib/equipModels';

const SLOT_FULL_NAMES = [
  "Head", "Chest", "Arms", "Waist", "Gloves", "Legs", "Feet",
  "Primary", "Secondary",
];

function EquipRow({ slot, modelCode, inspectName }: {
  slot: number;
  modelCode: number;
  inspectName?: string;
}) {
  const modelDisplay = equipSlotDisplay(slot, modelCode);
  if (!modelDisplay && !inspectName) return null;
  const label = SLOT_FULL_NAMES[slot] ?? slotLabel(slot);
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="w-16 shrink-0 text-muted-foreground">{label}</span>
      <span className="truncate">
        {inspectName || modelDisplay}
        {inspectName && modelDisplay && modelDisplay !== inspectName && (
          <span className="ml-1 text-muted-foreground/60">({modelDisplay})</span>
        )}
      </span>
    </div>
  );
}

export function SpawnInspectPanel({
  spawnId,
  store,
  tick,
  onClose,
}: {
  spawnId: number;
  store: SpawnStore;
  tick: number;
  onClose: () => void;
}) {
  void tick; // drives re-render when inspect data arrives
  const spawn = store.byId(spawnId);
  const inspect = store.inspectFor(spawnId);

  const title = spawn
    ? `${spawn.name || '(unknown)'} (${spawn.level})`
    : `Spawn #${spawnId}`;

  const hpPct =
    spawn && spawn.hpMax > 0
      ? Math.round((spawn.hpCur / spawn.hpMax) * 100)
      : null;

  const models = spawn?.equipModels ?? [];

  // Build inspect name overlay: EQ worn-slot indices. The standard mapping
  // for what shows in the inspect window:
  //   slot 0 = ear1, 1 = head, 2 = face, 3 = ear2, 4 = neck, 5 = shoulder,
  //   6 = arms, 7 = back, 8 = wrist1, 9 = wrist2, 10 = range, 11 = hands,
  //   12 = primary, 13 = secondary, 14-16 = ring/ring/chest, 17 = legs,
  //   18 = feet, 19 = waist, 20 = powersource, 21 = ammo, 22 = (unused)
  // Map spawn visual slots (0-8) to inspect slots for name overlay:
  const VISUAL_TO_INSPECT: Record<number, number> = {
    0: 1,   // Head
    1: 16,  // Chest
    2: 6,   // Arms
    3: 19,  // Waist
    4: 11,  // Gloves
    5: 17,  // Legs
    6: 18,  // Feet
    7: 12,  // Primary
    8: 13,  // Secondary
  };

  const anyEquip = models.some((m, i) => i < 9 && equipSlotDisplay(i, m));
  const hasInspect = !!inspect && inspect.itemNames.some(n => n.length > 0);

  return (
    <FloatingWindow
      id={`spawn-inspect-${spawnId}`}
      title={title}
      defaultSize={{ w: 280, h: 240 }}
      minSize={{ w: 220, h: 160 }}
      onClose={onClose}
    >
      {spawn ? (
        <div className="flex flex-col gap-1 p-2 text-xs text-foreground">
          <div className="flex items-baseline gap-1.5">
            <span className="w-16 shrink-0 text-muted-foreground">Class</span>
            <span>{classNameOf(spawn.class) || '—'}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="w-16 shrink-0 text-muted-foreground">Race</span>
            <span>{spawn.race ? raceName(spawn.race) : '—'}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="w-16 shrink-0 text-muted-foreground">HP</span>
            <span>{hpPct !== null ? `${hpPct}%` : '—'}</span>
          </div>
          {/* Only the daemon can resolve a guild name (it keys guild_id +
              guild_server_id against the zone's guild roster), so an unguilded
              spawn and one whose guild hasn't been named yet both arrive empty.
              Hide the row rather than showing a bare id. */}
          {spawn.guildTag && (
            <div className="flex items-baseline gap-1.5">
              <span className="w-16 shrink-0 text-muted-foreground">Guild</span>
              <span className="truncate">{spawn.guildTag}</span>
            </div>
          )}

          {anyEquip && (
            <div className="mt-1 border-t border-border pt-1">
              {Array.from({ length: 9 }, (_, i) => {
                const inspectIdx = VISUAL_TO_INSPECT[i];
                const inspectName = inspect?.itemNames[inspectIdx]?.trim() || undefined;
                return (
                  <EquipRow
                    key={i}
                    slot={i}
                    modelCode={models[i] ?? 0}
                    inspectName={inspectName}
                  />
                );
              })}
            </div>
          )}

          {!anyEquip && !hasInspect && (
            <div className="mt-1 border-t border-border pt-1 text-muted-foreground">
              Nothing equipped
            </div>
          )}

          {hasInspect && inspect?.bio && (
            <div className="mt-1 border-t border-border pt-1 italic text-muted-foreground">
              {inspect.bio}
            </div>
          )}

          {!hasInspect && (
            <div className="mt-1 text-muted-foreground/60">
              /inspect for item names
            </div>
          )}
        </div>
      ) : (
        <div className="p-2 text-xs text-muted-foreground">Spawn not found</div>
      )}
    </FloatingWindow>
  );
}
