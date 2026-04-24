import { useEffect, useState } from 'react';

// Phase 0 placeholder. Phase 1 wires the WebSocket + protobuf client,
// Snapshot handling, and the MapCanvas. Kept intentionally minimal so the
// scaffold builds without generated protobuf files.
export function App() {
  const [wsStatus, setWsStatus] = useState<'disconnected' | 'connecting' | 'open'>('disconnected');

  useEffect(() => {
    setWsStatus('connecting');
    const ws = new WebSocket('ws://localhost:9090');
    ws.onopen = () => setWsStatus('open');
    ws.onclose = () => setWsStatus('disconnected');
    return () => ws.close();
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>ShowEQ</h1>
      <p>daemon status: <code>{wsStatus}</code></p>
      <p style={{ opacity: 0.6 }}>
        Phase 0 scaffold. Map + spawn rendering lands in Phase 1.
      </p>
    </main>
  );
}
