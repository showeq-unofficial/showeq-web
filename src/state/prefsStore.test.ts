import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function clearAllShoweqStorage() {
  for (const k of [...Object.keys(localStorage)]) {
    if (k.startsWith('showeq.')) localStorage.removeItem(k);
  }
}

beforeEach(() => {
  clearAllShoweqStorage();
  vi.resetModules();
});
afterEach(() => {
  clearAllShoweqStorage();
});

async function loadStore() {
  return await import('./prefsStore');
}

describe('prefsStore — defaults', () => {
  it('matches the documented defaults when nothing is persisted', async () => {
    const { usePrefsStore } = await loadStore();
    const s = usePrefsStore.getState();
    expect(s.selectOnConsider).toBe(false);
    expect(s.selectOnTarget).toBe(false);
    expect(s.deselectOnUntarget).toBe(false);
    expect(s.trackPlayer).toBe(false);
    // smoothMovement defaults true to match the legacy localPrefs default.
    expect(s.smoothMovement).toBe(true);
  });
});

describe('prefsStore — legacy migration', () => {
  it('reads "1"/"0" string flags into booleans', async () => {
    localStorage.setItem('showeq.selectOnConsider', '1');
    localStorage.setItem('showeq.selectOnTarget', '0');
    localStorage.setItem('showeq.deselectOnUntarget', '1');
    localStorage.setItem('showeq.trackPlayer', '1');
    localStorage.setItem('showeq.smoothMovement', '0');
    const { usePrefsStore } = await loadStore();
    const s = usePrefsStore.getState();
    expect(s.selectOnConsider).toBe(true);
    expect(s.selectOnTarget).toBe(false);
    expect(s.deselectOnUntarget).toBe(true);
    expect(s.trackPlayer).toBe(true);
    expect(s.smoothMovement).toBe(false);
  });

  it('treats absent legacy keys as their respective defaults', async () => {
    // Only one is set — the rest should fall through to defaults
    // (smoothMovement true, others false).
    localStorage.setItem('showeq.selectOnTarget', '1');
    const { usePrefsStore } = await loadStore();
    const s = usePrefsStore.getState();
    expect(s.selectOnTarget).toBe(true);
    expect(s.selectOnConsider).toBe(false);
    expect(s.smoothMovement).toBe(true);
  });
});

describe('prefsStore — actions', () => {
  it('each setter flips state', async () => {
    const { usePrefsStore } = await loadStore();
    const s = usePrefsStore.getState();
    s.setSelectOnConsider(true);
    s.setSelectOnTarget(true);
    s.setDeselectOnUntarget(true);
    s.setTrackPlayer(true);
    s.setSmoothMovement(false);
    const after = usePrefsStore.getState();
    expect(after.selectOnConsider).toBe(true);
    expect(after.selectOnTarget).toBe(true);
    expect(after.deselectOnUntarget).toBe(true);
    expect(after.trackPlayer).toBe(true);
    expect(after.smoothMovement).toBe(false);
  });

  it('persists state changes into showeq.prefs', async () => {
    const { usePrefsStore } = await loadStore();
    usePrefsStore.getState().setTrackPlayer(true);
    const persisted = JSON.parse(localStorage.getItem('showeq.prefs') ?? '{}');
    expect(persisted.state.trackPlayer).toBe(true);
    // partialize should *not* persist actions
    expect(persisted.state.setTrackPlayer).toBeUndefined();
  });

  it('rehydrates from showeq.prefs on next load', async () => {
    // Write a "previous session" persisted blob, then reload module.
    localStorage.setItem('showeq.prefs', JSON.stringify({
      state: {
        selectOnConsider: true,
        selectOnTarget: false,
        deselectOnUntarget: true,
        trackPlayer: false,
        smoothMovement: false,
      },
      version: 1,
    }));
    const { usePrefsStore } = await loadStore();
    const s = usePrefsStore.getState();
    expect(s.selectOnConsider).toBe(true);
    expect(s.deselectOnUntarget).toBe(true);
    expect(s.smoothMovement).toBe(false);
  });
});
