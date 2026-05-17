import { useBoxStore } from '../state/boxStore';

// Header dropdown showing every EQ client the daemon has observed
// (Stage 4 of ../showeq-daemon/docs/MULTIBOX_PLAN.md). Hidden when
// only zero or one boxes are present — no point cluttering the
// header for the single-client case. Selection emits SetActiveBox;
// the daemon broadcasts a fresh BoxListUpdated with the new
// active_box_id which flows back through useBoxStore.

interface Props {
  onChange: (boxId: string) => void;
}

export function BoxPicker({ onChange }: Props) {
  const boxes       = useBoxStore((s) => s.boxes);
  const activeBoxId = useBoxStore((s) => s.activeBoxId);

  if (boxes.length <= 1) return null;

  return (
    <label className="flex items-center gap-1 text-xs text-foreground/80">
      <span className="text-foreground/60">box</span>
      <select
        value={activeBoxId}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-border bg-bg-base px-1 py-0.5 font-mono text-xs text-foreground focus:border-ring focus:outline-none"
      >
        {boxes.map((b) => (
          <option key={b.boxId} value={b.boxId}>
            {b.displayName || b.boxId.slice(0, 10)}
            {b.clientIp ? ` (${b.clientIp})` : ''}
          </option>
        ))}
      </select>
    </label>
  );
}
