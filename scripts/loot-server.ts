// Read-only HTTP query API over loot.db for the browser loot view. Shares the
// process + DB file with the recorder (loot-recorder.ts) but opens its own
// read-only handle, so reads never contend with the writer's prepared
// statements (WAL allows concurrent readers). CORS-open so the Vite-served UI
// (and the user's LAN Chrome session) can fetch it.
import { Database } from 'bun:sqlite';
import { RECENT_LOOT_SQL } from '../src/recorder/queries';

const CORS = { 'Access-Control-Allow-Origin': '*' } as const;

export function startLootServer(dbPath: string, port: number) {
  const db = new Database(dbPath, { readonly: true });
  return Bun.serve({
    port,
    fetch(req) {
      const u = new URL(req.url);
      if (u.pathname === '/api/health') {
        return Response.json({ ok: true, db: dbPath }, { headers: CORS });
      }
      if (u.pathname === '/api/loot') {
        const raw = Number(u.searchParams.get('limit'));
        const limit = Math.min(Math.max(Number.isFinite(raw) && raw > 0 ? raw : 5000, 1), 50000);
        return Response.json(db.query(RECENT_LOOT_SQL).all(limit), { headers: CORS });
      }
      return new Response('not found', { status: 404, headers: CORS });
    },
  });
}

// Standalone: serve an existing loot.db without the recorder.
//   bun scripts/loot-server.ts <db> [port]
if (import.meta.main) {
  const dbPath = process.argv[2];
  const port = Number(process.argv[3]) || 9092;
  if (!dbPath) {
    console.error('usage: bun scripts/loot-server.ts <db> [port]');
    process.exit(1);
  }
  startLootServer(dbPath, port);
  console.log(`loot API → http://localhost:${port}/api/loot   (db=${dbPath})`);
}
