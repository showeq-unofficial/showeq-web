// Generic EQ sprite-atlas icon. Icons live in `public/icons/{atlas}{NNN}.png`
// (3-digit zero-padded), each a 256x256 atlas of a 6x6 grid of 40x40 sprites
// (see scripts/gen-item-icons.py). Item icons use the `dragitem` atlas
// (base 500); spell icons use the `spells` atlas (base 0). `base` shifts the id
// origin.
//
//   file = (icon-base)//36 + 1 ; cell = (icon-base)%36 ; col = cell%6 ; row = cell//6
//
// The PNGs are gitignored (can't ship EQ client art), so on a checkout that
// hasn't run gen-item-icons.py they're absent. We probe each atlas once and
// render nothing when it's missing — the icon is always additive (the loot/buff
// name text is shown beside it), so it degrades cleanly to text-only.
import { useSyncExternalStore } from 'react';

const CELL = 40; // native sprite size in the atlas
const ATLAS = 256; // native atlas dimension

const pad3 = (n: number) => String(n).padStart(3, '0');

// Per-atlas presence: null = probing, true/false = resolved.
const present: Record<string, boolean | null | undefined> = {};
const listeners = new Set<() => void>();

function probe(atlas: string) {
  if (atlas in present) return;
  present[atlas] = null;
  const img = new Image();
  img.onload = () => { present[atlas] = true; listeners.forEach((l) => l()); };
  img.onerror = () => { present[atlas] = false; listeners.forEach((l) => l()); };
  img.src = `/icons/${atlas}${pad3(1)}.png`;
}

function useAtlasPresent(atlas: string) {
  return useSyncExternalStore(
    (cb) => { probe(atlas); listeners.add(cb); return () => listeners.delete(cb); },
    () => present[atlas],
    () => present[atlas],
  );
}

export function ItemIcon({
  icon,
  size = CELL,
  atlas = 'dragitem',
  base = 500,
}: {
  icon: number;
  size?: number;
  atlas?: string;
  base?: number;
}) {
  const avail = useAtlasPresent(atlas);
  if (avail === false) return null; // icons not generated -> text-only

  const idx = icon - base;
  const file = Math.floor(idx / 36) + 1;
  // no icon for this item (invalid id) but the atlas exists -> keep the slot size.
  if (icon < base || idx < 0 || file < 1) {
    return <span className="inline-block shrink-0" style={{ width: size, height: size }} aria-hidden />;
  }
  const cell = idx % 36;
  const col = cell % 6;
  const row = Math.floor(cell / 6);
  const scale = size / CELL;
  return (
    <span
      className="inline-block shrink-0"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(/icons/${atlas}${pad3(file)}.png)`,
        backgroundPosition: `-${col * size}px -${row * size}px`,
        backgroundSize: `${ATLAS * scale}px ${ATLAS * scale}px`,
        backgroundRepeat: 'no-repeat',
      }}
      aria-hidden
    />
  );
}
