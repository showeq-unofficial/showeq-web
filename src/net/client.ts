import { create, fromBinary, toBinary } from '@bufbuild/protobuf';
import {
  AddFilterRuleSchema,
  ClientEnvelopeSchema,
  RemoveFilterRuleSchema,
  SetPrefSchema,
  SubscribeSchema,
  Topic,
} from '@gen/seq/v1/client_pb';
import {
  EnvelopeSchema,
  PrefSchema,
  type Envelope,
} from '@gen/seq/v1/events_pb';

export type EnvelopeListener = (env: Envelope) => void;

// Minimal WebSocket client that speaks seq.v1 protobuf. Connects, sends a
// Subscribe on open, and fans out incoming Envelope messages to listeners.
// Reconnects with exponential backoff on disconnect — the daemon may be
// restarted during capture sessions.
export class SeqClient {
  private ws?: WebSocket;
  private listeners = new Set<EnvelopeListener>();
  private backoffMs = 250;
  private closed = false;

  constructor(private readonly url: string) {}

  connect(): void {
    if (this.closed) return;
    const ws = new WebSocket(this.url);
    ws.binaryType = 'arraybuffer';
    this.ws = ws;

    ws.onopen = () => {
      this.backoffMs = 250;
      const env = create(ClientEnvelopeSchema, {
        payload: {
          case: 'subscribe',
          value: create(SubscribeSchema, {
            topics: [Topic.SPAWNS, Topic.ZONE, Topic.PLAYER],
          }),
        },
      });
      ws.send(toBinary(ClientEnvelopeSchema, env));
    };

    ws.onmessage = (ev) => {
      if (!(ev.data instanceof ArrayBuffer)) return;
      const bytes = new Uint8Array(ev.data);
      try {
        const env = fromBinary(EnvelopeSchema, bytes);
        for (const l of this.listeners) l(env);
      } catch (err) {
        console.warn('failed to decode Envelope', err);
      }
    };

    ws.onclose = () => this.scheduleReconnect();
    ws.onerror = () => ws.close();
  }

  close(): void {
    this.closed = true;
    this.ws?.close();
  }

  onEnvelope(fn: EnvelopeListener): () => void {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }

  // Filter rule mutation: daemon applies via FilterMgr and broadcasts a
  // refreshed FilterRulesUpdate to all connected clients on success.
  // Silently no-ops if the socket isn't open — caller can react to the
  // resulting (or missing) FilterRulesUpdate to confirm.
  addFilterRule(filterType: number, pattern: string, perZone: boolean): void {
    const env = create(ClientEnvelopeSchema, {
      payload: {
        case: 'addFilterRule',
        value: create(AddFilterRuleSchema, { filterType, pattern, perZone }),
      },
    });
    this.send(env);
  }

  removeFilterRule(filterType: number, pattern: string, perZone: boolean): void {
    const env = create(ClientEnvelopeSchema, {
      payload: {
        case: 'removeFilterRule',
        value: create(RemoveFilterRuleSchema, { filterType, pattern, perZone }),
      },
    });
    this.send(env);
  }

  // Preference mutation. The daemon validates against its allowlist, persists
  // via XMLPreferences, and broadcasts a PrefChanged envelope to every
  // connected client (including this one). Caller picks the value variant by
  // passing exactly one of the four shapes.
  setPref(
    section: string,
    key: string,
    value:
      | { stringValue: string }
      | { intValue: bigint }
      | { doubleValue: number }
      | { boolValue: boolean },
  ): void {
    let pref;
    if ('stringValue' in value) {
      pref = create(PrefSchema, { section, key, value: { case: 'stringValue', value: value.stringValue } });
    } else if ('intValue' in value) {
      pref = create(PrefSchema, { section, key, value: { case: 'intValue', value: value.intValue } });
    } else if ('doubleValue' in value) {
      pref = create(PrefSchema, { section, key, value: { case: 'doubleValue', value: value.doubleValue } });
    } else {
      pref = create(PrefSchema, { section, key, value: { case: 'boolValue', value: value.boolValue } });
    }
    const env = create(ClientEnvelopeSchema, {
      payload: { case: 'setPref', value: create(SetPrefSchema, { pref }) },
    });
    this.send(env);
  }

  private send(env: ReturnType<typeof create<typeof ClientEnvelopeSchema>>): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(toBinary(ClientEnvelopeSchema, env));
  }

  private scheduleReconnect(): void {
    if (this.closed) return;
    const delay = this.backoffMs;
    this.backoffMs = Math.min(this.backoffMs * 2, 5_000);
    setTimeout(() => this.connect(), delay);
  }
}
