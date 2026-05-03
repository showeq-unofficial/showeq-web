import { useEffect, useState } from 'react';
import { create } from '@bufbuild/protobuf';
import {
  NetworkDeviceSchema,
  type NetworkDevice,
} from '@gen/seq/v1/events_pb';
import type { SeqClient } from '../net/client';
import type { SpawnStore } from '../state/store';
import { ChatColorsPanel } from './ChatColorsPanel';

// Preferences tab body. Daemon-side prefs flow through PrefsBroker:
// each editor reads the current value from the store, lets the user
// edit locally, and on commit (Save / Enter / change) sends a SetPref.
// The daemon echoes a PrefChanged that re-syncs the store, so the UI
// converges even if multiple clients are editing.
//
// New keys land here as they're added to the daemon allowlist
// (showeq-daemon/src/prefsbroker.cpp).
export function PreferencesPanel({
  store,
  client,
  tick,
}: {
  store: SpawnStore;
  client: SeqClient | null;
  tick: number;
}) {
  void tick;
  const dtf = store.pref('Interface', 'DateTimeFormat');
  const dtfCurrent =
    dtf?.value.case === 'stringValue' ? dtf.value.value : '';

  const [dtfDraft, setDtfDraft] = useState(dtfCurrent);
  // Re-seed the draft whenever the daemon-side value changes (e.g. on
  // initial PrefsSnapshot, or when another client edits).
  useEffect(() => { setDtfDraft(dtfCurrent); }, [dtfCurrent]);

  const dirty = dtfDraft !== dtfCurrent;
  const commit = () => {
    if (!client || !dirty) return;
    client.setPref('Interface', 'DateTimeFormat', { stringValue: dtfDraft });
  };

  // Network/Device — combobox populated by a ListDevices RPC. Daemon
  // calls EQPacket::monitorDevice on apply; the user has to zone for
  // fresh decode state to flow (same semantics as showeq-c).
  const devicePref = store.pref('Network', 'Device');
  const deviceCurrent =
    devicePref?.value.case === 'stringValue' ? devicePref.value.value : '';

  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [devicesLoaded, setDevicesLoaded] = useState(false);
  // One-shot envelope listener for the DevicesList reply. The daemon
  // also broadcasts unrelated traffic on the same socket, so we filter
  // by case and unsubscribe once we have the list. We re-fetch on
  // mount each time the panel opens; pcap interfaces can change while
  // the daemon is running (USB ethernet, VPN tunnels, etc.).
  useEffect(() => {
    if (!client) return;
    const unsub = client.onEnvelope((env) => {
      if (env.payload.case === 'devicesList') {
        setDevices(env.payload.value.devices);
        setDevicesLoaded(true);
      }
    });
    client.listDevices();
    return unsub;
  }, [client]);

  const setDevice = (name: string) => {
    if (!client) return;
    client.setPref('Network', 'Device', { stringValue: name });
  };

  // Network/IP — text input. Empty / "127.0.0.0" both mean
  // auto-detect-next-session. Commit on Enter / blur.
  const ipPref = store.pref('Network', 'IP');
  const ipCurrent =
    ipPref?.value.case === 'stringValue' ? ipPref.value.value : '';
  const [ipDraft, setIpDraft] = useState(ipCurrent);
  useEffect(() => { setIpDraft(ipCurrent); }, [ipCurrent]);
  const ipDirty = ipDraft !== ipCurrent;
  const commitIp = () => {
    if (!client || !ipDirty) return;
    client.setPref('Network', 'IP', { stringValue: ipDraft });
  };

  // Show the saved device even when it isn't (yet) in the enumerated
  // list — pcap_findalldevs can miss freshly-disconnected interfaces.
  const deviceOptions = (() => {
    const opts = [...devices];
    if (deviceCurrent && !opts.some((d) => d.name === deviceCurrent)) {
      opts.unshift(create(NetworkDeviceSchema, {
        name: deviceCurrent,
        description: '(saved)',
        isLoopback: false,
      }));
    }
    return opts;
  })();

  return (
    <div className="flex flex-col gap-4 px-4 py-4 text-xs">
      <section className="flex flex-col gap-2">
        <label className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Capture
        </label>
        <label className="flex items-center gap-2">
          <span className="w-20 text-foreground">Device</span>
          <select
            value={deviceCurrent}
            onChange={(e) => setDevice(e.target.value)}
            disabled={!client}
            className="flex-1 rounded border border-border bg-bg-base px-2 py-1 font-mono text-[11px] text-foreground focus:border-blue-500 focus:outline-none disabled:opacity-50"
          >
            {!deviceCurrent && (
              <option value="" disabled>
                {devicesLoaded ? 'select a device…' : 'loading…'}
              </option>
            )}
            {deviceOptions.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name}
                {d.isLoopback ? ' (loopback)' : ''}
                {d.description ? ` — ${d.description}` : ''}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => { setDevicesLoaded(false); client?.listDevices(); }}
            disabled={!client}
            className="rounded border border-border bg-bg-alt px-2 py-1 text-[10px] text-foreground hover:bg-bg-base disabled:cursor-not-allowed disabled:opacity-50"
            title="Refresh device list"
          >
            ↻
          </button>
        </label>
        <label className="flex items-center gap-2">
          <span className="w-20 text-foreground">Client IP</span>
          <input
            type="text"
            value={ipDraft}
            onChange={(e) => setIpDraft(e.target.value)}
            onBlur={commitIp}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); commitIp(); }
              if (e.key === 'Escape') { setIpDraft(ipCurrent); }
            }}
            spellCheck={false}
            placeholder="127.0.0.0"
            className="flex-1 rounded border border-border bg-bg-base px-2 py-1 font-mono text-[11px] text-foreground focus:border-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={commitIp}
            disabled={!client || !ipDirty}
            className="rounded border border-border bg-bg-alt px-2 py-1 text-[10px] text-foreground hover:bg-bg-base disabled:cursor-not-allowed disabled:opacity-50"
          >
            save
          </button>
        </label>
        <p className="text-muted-foreground">
          You must zone for changes to take effect — the daemon needs a
          fresh login handshake to decode a new session. Use{' '}
          <code className="text-muted-foreground">127.0.0.0</code> (or empty)
          to auto-detect the next EQ client seen on the wire.
        </p>
      </section>
      <section className="flex flex-col gap-1">
        <label className="text-[11px] uppercase tracking-wide text-muted-foreground">
          Chat timestamp format
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={dtfDraft}
            onChange={(e) => setDtfDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); commit(); }
              if (e.key === 'Escape') { setDtfDraft(dtfCurrent); }
            }}
            spellCheck={false}
            className="flex-1 rounded border border-border bg-bg-base px-2 py-1 font-mono text-[11px] text-foreground focus:border-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={commit}
            disabled={!client || !dirty}
            className="rounded border border-border bg-bg-alt px-2 py-1 text-[10px] text-foreground hover:bg-bg-base disabled:cursor-not-allowed disabled:opacity-50"
          >
            save
          </button>
        </div>
        <p className="text-muted-foreground">
          Qt date/time format string. Examples:{' '}
          <code className="text-muted-foreground">ddd MMM dd,yyyy - hh:mm ap</code>{' '}
          • <code className="text-muted-foreground">yyyy-MM-dd HH:mm:ss</code>.
          Saved daemon-side and shared across all connected clients.
        </p>
      </section>
      <hr className="border-border" />
      <ChatColorsPanel />
    </div>
  );
}
