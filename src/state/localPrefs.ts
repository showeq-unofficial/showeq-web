// Per-browser preferences stored in localStorage. These are pure UI
// concerns that don't round-trip through the daemon: each browser tab
// keeps its own toggle state, independent of other connected clients.

const KEY_SELECT_ON_CONSIDER  = 'showeq.selectOnConsider';
const KEY_SELECT_ON_TARGET    = 'showeq.selectOnTarget';
const KEY_DESELECT_ON_UNTARGET = 'showeq.deselectOnUntarget';
const KEY_TRACK_PLAYER        = 'showeq.trackPlayer';
const KEY_SMOOTH_MOVEMENT     = 'showeq.smoothMovement';

function readBool(key: string, fallback: boolean): boolean {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  return raw === '1';
}

function writeBool(key: string, value: boolean): void {
  localStorage.setItem(key, value ? '1' : '0');
}

export type WindowPos = { x: number; y: number };

function readPos(key: string): WindowPos {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const v = JSON.parse(raw);
      if (typeof v?.x === 'number' && typeof v?.y === 'number') return v;
    }
  } catch { /* ignore */ }
  return { x: 0, y: 0 };
}

function writePos(key: string, pos: WindowPos): void {
  try {
    localStorage.setItem(key, JSON.stringify(pos));
  } catch { /* ignore */ }
}

export const localPrefs = {
  selectOnConsider: () => readBool(KEY_SELECT_ON_CONSIDER, false),
  setSelectOnConsider: (v: boolean) => writeBool(KEY_SELECT_ON_CONSIDER, v),
  selectOnTarget: () => readBool(KEY_SELECT_ON_TARGET, false),
  setSelectOnTarget: (v: boolean) => writeBool(KEY_SELECT_ON_TARGET, v),
  deselectOnUntarget: () => readBool(KEY_DESELECT_ON_UNTARGET, false),
  setDeselectOnUntarget: (v: boolean) => writeBool(KEY_DESELECT_ON_UNTARGET, v),
  trackPlayer: () => readBool(KEY_TRACK_PLAYER, false),
  setTrackPlayer: (v: boolean) => writeBool(KEY_TRACK_PLAYER, v),
  smoothMovement: () => readBool(KEY_SMOOTH_MOVEMENT, true),
  setSmoothMovement: (v: boolean) => writeBool(KEY_SMOOTH_MOVEMENT, v),

  // Floating-window positions are offsets from the window's CSS-centered
  // initial position (the {0,0} default keeps it centered on first open).
  windowPos: (id: string): WindowPos => readPos(`showeq.windowPos.${id}`),
  setWindowPos: (id: string, pos: WindowPos) =>
    writePos(`showeq.windowPos.${id}`, pos),
};
