import { useAlertsStore } from '@/state/alertsStore';

// Tiny Text-to-Speech layer over the browser's Web Speech API
// (window.speechSynthesis + SpeechSynthesisUtterance). Parallels
// audioCue.ts: reads useAlertsStore.getState() for gating so it can be
// called from non-React contexts (envelope subscribers, the buff-warning
// hook). No runtime dependency — this is a native browser API.
//
// Voice selection is intentionally out of scope for v1: getVoices() is
// populated asynchronously (a `voiceschanged` event), and the default
// system voice is a fine baseline. Rate + volume are user-tunable via
// the Alerts settings tab.

function supported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function utter(text: string, volume: number, rate: number): void {
  const u = new SpeechSynthesisUtterance(text);
  u.volume = Math.max(0, Math.min(1, volume));
  u.rate = Math.max(0.5, Math.min(2, rate));
  // Like audio autoplay, some browsers gate speechSynthesis until the
  // page has seen a user gesture. There's no reject to swallow here (the
  // call just no-ops until unblocked), and the first click anywhere in
  // the app unblocks subsequent utterances — same tradeoff as audioCue's
  // `.play().catch()`.
  try {
    window.speechSynthesis.speak(u);
  } catch { /* speech unavailable or blocked — drop silently */ }
}

// Speak `text` if TTS is enabled. No-op when disabled or unsupported.
export function speak(text: string): void {
  if (!supported()) return;
  const s = useAlertsStore.getState();
  if (!s.speechEnabled) return;
  utter(text, s.speechVolume, s.speechRate);
}

// Speak regardless of the enabled flag — used by the settings "test"
// button so the user can audition the voice/rate/volume before turning
// TTS on. Still honors the configured volume + rate. Parallels
// audioCue's previewCue.
export function previewSpeech(text: string): void {
  if (!supported()) return;
  const s = useAlertsStore.getState();
  utter(text, s.speechVolume, s.speechRate);
}
