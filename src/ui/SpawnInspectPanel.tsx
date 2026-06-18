import { FloatingWindow } from './FloatingWindow';
import type { SpawnStore } from '../state/store';
import { classNameOf } from './classes';

const LUCY_URL = 'https://lucy.allakhazam.com/item.html?id=';

function ItemRow({ label, itemId, itemName }: {
  label: string;
  itemId: number;
  itemName: string;
}) {
  if (!itemId) return null;
  const display = itemName || `Item #${itemId}`;
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="w-14 shrink-0 text-muted-foreground">{label}</span>
      <a
        href={`${LUCY_URL}${itemId}`}
        target="_blank"
        rel="noreferrer"
        title={`Look up on Lucy (item ID ${itemId})`}
        className="truncate text-blue-400 hover:underline"
      >
        {display}
      </a>
    </div>
  );
}

export function SpawnInspectPanel({
  spawnId,
  store,
  onClose,
}: {
  spawnId: number;
  store: SpawnStore;
  onClose: () => void;
}) {
  const spawn = store.byId(spawnId);

  const title = spawn
    ? `${spawn.name || '(unknown)'} (${spawn.level})`
    : `Spawn #${spawnId}`;

  const hpPct =
    spawn && spawn.hpMax > 0
      ? Math.round((spawn.hpCur / spawn.hpMax) * 100)
      : null;

  return (
    <FloatingWindow
      id={`spawn-inspect-${spawnId}`}
      title={title}
      defaultSize={{ w: 260, h: 200 }}
      minSize={{ w: 200, h: 140 }}
      onClose={onClose}
    >
      {spawn ? (
        <div className="flex flex-col gap-1 p-2 text-xs text-foreground">
          <div className="flex items-baseline gap-1.5">
            <span className="w-14 shrink-0 text-muted-foreground">Class</span>
            <span>{classNameOf(spawn.class) || '—'}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="w-14 shrink-0 text-muted-foreground">Race</span>
            <span>{spawn.race || '—'}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="w-14 shrink-0 text-muted-foreground">HP</span>
            <span>
              {hpPct !== null ? `${hpPct}%` : '—'}
            </span>
          </div>
          {(spawn.primaryItemId > 0 || spawn.secondaryItemId > 0) && (
            <div className="mt-1 border-t border-border pt-1">
              <ItemRow
                label="Primary"
                itemId={spawn.primaryItemId}
                itemName={spawn.primaryItemName}
              />
              <ItemRow
                label="Secondary"
                itemId={spawn.secondaryItemId}
                itemName={spawn.secondaryItemName}
              />
            </div>
          )}
          {spawn.primaryItemId === 0 && spawn.secondaryItemId === 0 && (
            <div className="mt-1 border-t border-border pt-1 text-muted-foreground">
              Nothing held
            </div>
          )}
        </div>
      ) : (
        <div className="p-2 text-xs text-muted-foreground">Spawn not found</div>
      )}
    </FloatingWindow>
  );
}
