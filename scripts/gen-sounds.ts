/**
 * Generates the bundled alert WAVs in `public/sounds/`. Each cue is a
 * short tone shaped to be distinct from the others without being long
 * or piercing — every cue may fire several times per minute on a busy
 * zone, so length matters as much as timbre.
 *
 *   bun scripts/gen-sounds.ts
 *
 * Re-run after editing this file to refresh the committed WAVs. The
 * outputs are deterministic (no randomness) so re-running with the same
 * tone definitions produces the same bytes.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'public', 'sounds');
mkdirSync(OUT_DIR, { recursive: true });

const SAMPLE_RATE = 22050;

type Segment = {
  // Frequency at start (linearly ramps to `freqEnd` if set).
  freq: number;
  freqEnd?: number;
  durationMs: number;
  // Amplitude 0..1; pre-ADSR. Defaults to 0.6 so the bundled cues sit
  // below clipping with master volume = 1.0.
  amp?: number;
  // 'sine' | 'triangle' | 'square'. Most cues use sine for gentleness;
  // danger uses triangle for a slightly harsher edge.
  shape?: 'sine' | 'triangle' | 'square';
  // Linear silence padded after the segment. Used to chain beep/gap/beep
  // patterns into one cue.
  gapMsAfter?: number;
};

// 5 ms of fade-in/fade-out on each segment to avoid the click that a
// hard-edged WAV start/stop produces in <audio> playback.
const FADE_MS = 5;

function renderSegment(seg: Segment): Float32Array {
  const sampleCount = Math.round((seg.durationMs / 1000) * SAMPLE_RATE);
  const out = new Float32Array(sampleCount);
  const fadeSamples = Math.round((FADE_MS / 1000) * SAMPLE_RATE);
  const amp = seg.amp ?? 0.6;
  const shape = seg.shape ?? 'sine';
  let phase = 0;
  for (let i = 0; i < sampleCount; i++) {
    const t = i / sampleCount;
    const freq = seg.freqEnd
      ? seg.freq + (seg.freqEnd - seg.freq) * t
      : seg.freq;
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    let s: number;
    if (shape === 'sine') s = Math.sin(phase);
    else if (shape === 'triangle') s = (2 / Math.PI) * Math.asin(Math.sin(phase));
    else /* square */ s = Math.sin(phase) >= 0 ? 0.7 : -0.7;

    let env = 1;
    if (i < fadeSamples) env = i / fadeSamples;
    else if (i > sampleCount - fadeSamples) env = (sampleCount - i) / fadeSamples;
    out[i] = s * amp * env;
  }
  return out;
}

function renderCue(segments: Segment[]): Float32Array {
  let total = 0;
  const rendered: { samples: Float32Array; gap: number }[] = [];
  for (const seg of segments) {
    const samples = renderSegment(seg);
    const gap = Math.round(((seg.gapMsAfter ?? 0) / 1000) * SAMPLE_RATE);
    rendered.push({ samples, gap });
    total += samples.length + gap;
  }
  const out = new Float32Array(total);
  let pos = 0;
  for (const r of rendered) {
    out.set(r.samples, pos);
    pos += r.samples.length + r.gap;
  }
  return out;
}

// 16-bit PCM, mono. Smallest container the browser <audio> element
// reliably decodes without an extra codec pass.
function encodeWav(samples: Float32Array): Buffer {
  const headerSize = 44;
  const dataSize = samples.length * 2;
  const buf = Buffer.alloc(headerSize + dataSize);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);          // fmt chunk size
  buf.writeUInt16LE(1, 20);           // PCM
  buf.writeUInt16LE(1, 22);           // mono
  buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  buf.writeUInt16LE(2, 32);           // block align
  buf.writeUInt16LE(16, 34);          // bits per sample
  buf.write('data', 36);
  buf.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(clamped * 0x7fff), headerSize + i * 2);
  }
  return buf;
}

const CUES: Record<string, Segment[]> = {
  // Rising chime — friendly, signals "your hunt target showed up".
  hunt:    [{ freq: 660, freqEnd: 990, durationMs: 220, shape: 'sine' }],
  // Mid-pitch single beep — neutral attention.
  caution: [{ freq: 520, durationMs: 240, shape: 'sine' }],
  // Two low triangle beeps — alarming without being shrill.
  danger:  [
    { freq: 280, durationMs: 110, shape: 'triangle', amp: 0.7, gapMsAfter: 60 },
    { freq: 280, durationMs: 110, shape: 'triangle', amp: 0.7 },
  ],
  // Short high tic — locate is informational, deliberately brief.
  locate:  [{ freq: 1320, durationMs: 90, shape: 'sine', amp: 0.45 }],
  // Square-flavored mid tone — distinct from caution by timbre.
  alert:   [{ freq: 587, durationMs: 220, shape: 'square', amp: 0.45 }],
  // Falling two-tone — "something's leaving".
  buffFading: [
    { freq: 660, durationMs: 140, shape: 'sine', gapMsAfter: 30 },
    { freq: 440, durationMs: 220, shape: 'sine' },
  ],
};

for (const [name, segments] of Object.entries(CUES)) {
  const samples = renderCue(segments);
  const wav = encodeWav(samples);
  const path = resolve(OUT_DIR, `${kebab(name)}.wav`);
  writeFileSync(path, wav);
  console.log(`wrote ${path}  (${wav.length} bytes, ${(samples.length / SAMPLE_RATE * 1000).toFixed(0)}ms)`);
}

function kebab(s: string): string {
  return s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
}
