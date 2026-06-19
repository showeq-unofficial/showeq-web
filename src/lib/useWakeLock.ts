import { useEffect } from 'react';

export function useWakeLock() {
  useEffect(() => {
    if (!('wakeLock' in navigator)) return;

    let sentinel: WakeLockSentinel | null = null;

    async function acquire() {
      if (document.visibilityState !== 'visible') return;
      try {
        sentinel = await navigator.wakeLock.request('screen');
      } catch {
        // Permission denied or tab hidden mid-request — ignore
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        acquire();
      }
    }

    acquire();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      sentinel?.release();
    };
  }, []);
}
