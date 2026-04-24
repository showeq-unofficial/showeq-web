import { useEffect, useMemo, useState } from 'react';
import { SeqClient } from '../net/client';
import { SpawnStore } from '../state/store';
import { MapCanvas } from './MapCanvas';

type ConnStatus = 'disconnected' | 'connecting' | 'open';

const DEFAULT_URL = `ws://${window.location.hostname || 'localhost'}:9090`;

export function App() {
  const store = useMemo(() => new SpawnStore(), []);
  const [status, setStatus] = useState<ConnStatus>('disconnected');
  const [url] = useState(DEFAULT_URL);

  useEffect(() => {
    setStatus('connecting');
    const client = new SeqClient(url);
    const detachEnv = client.onEnvelope((env) => store.apply(env));
    const ws = { detach: () => { client.close(); detachEnv(); } };

    // We piggy-back on SeqClient's open/close lifecycle by polling:
    // simpler than surfacing yet more listeners for a Phase 1 demo.
    const tick = setInterval(() => {
      const w = (client as unknown as { ws?: WebSocket }).ws;
      if (!w) return;
      switch (w.readyState) {
        case WebSocket.CONNECTING: setStatus('connecting'); break;
        case WebSocket.OPEN:       setStatus('open');       break;
        default:                   setStatus('disconnected');
      }
    }, 500);

    client.connect();
    return () => { clearInterval(tick); ws.detach(); };
  }, [store, url]);

  return (
    <main style={{ fontFamily: 'system-ui', color: '#ddd', background: '#14181c', minHeight: '100vh', padding: 16 }}>
      <header style={{ marginBottom: 12, display: 'flex', gap: 16, alignItems: 'baseline' }}>
        <h1 style={{ margin: 0, fontSize: 18 }}>ShowEQ</h1>
        <span style={{ opacity: 0.7 }}>{url}</span>
        <span style={{
          padding: '2px 8px',
          borderRadius: 4,
          background: status === 'open' ? '#1a5' : status === 'connecting' ? '#a81' : '#a22',
          fontSize: 12,
        }}>{status}</span>
      </header>
      <MapCanvas store={store} />
    </main>
  );
}
