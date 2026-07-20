// Loot data access for the loot view. Browser path: fetch the recorder's HTTP
// query API (loot-server.ts), derived from the daemon host. Tauri desktop path
// (read loot.db directly via tauri-plugin-sql) is a follow-up gated on the
// in-app recorder; isTauri() is here for when it lands.
import { RECENT_LOOT_SQL, type LootRecord } from '@/recorder/queries';
import type Database from '@tauri-apps/plugin-sql';

export type { LootRecord };

const LOOT_API_OVERRIDE_KEY = 'showeq.lootApiUrl';
const DEFAULT_LOOT_PORT = 9092;

export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

// Same host as the daemon, on the loot API port — unless pinned in localStorage.
export function lootApiBase(daemonWsUrl: string): string {
  const override = typeof localStorage !== 'undefined' ? localStorage.getItem(LOOT_API_OVERRIDE_KEY) : null;
  if (override) return override.replace(/\/+$/, '');
  try {
    const u = new URL(daemonWsUrl);
    const scheme = u.protocol === 'wss:' ? 'https' : 'http';
    return `${scheme}://${u.hostname}:${DEFAULT_LOOT_PORT}`;
  } catch {
    return `http://localhost:${DEFAULT_LOOT_PORT}`;
  }
}

export async function fetchLoot(base: string, limit = 5000): Promise<LootRecord[]> {
  if (isTauri()) return fetchLootTauri(limit);
  const res = await fetch(`${base}/api/loot?limit=${limit}`);
  if (!res.ok) throw new Error(`loot API responded ${res.status}`);
  return (await res.json()) as LootRecord[];
}

// Desktop build reads loot.db directly via tauri-plugin-sql (no HTTP host).
let tauriDb: Promise<Database> | null = null;
async function fetchLootTauri(limit: number): Promise<LootRecord[]> {
  if (!tauriDb) {
    tauriDb = (async () => {
      const { default: SqlDatabase } = await import('@tauri-apps/plugin-sql');
      const { homeDir, join } = await import('@tauri-apps/api/path');
      return SqlDatabase.load(`sqlite:${await join(await homeDir(), '.showeq', 'loot.db')}`);
    })();
  }
  const db = await tauriDb;
  return db.select<LootRecord[]>(RECENT_LOOT_SQL.replace('LIMIT ?', 'LIMIT $1'), [
    Math.max(1, Math.floor(limit)),
  ]);
}

const COIN: ReadonlyArray<readonly [string, number]> = [['p', 1000], ['g', 100], ['s', 10], ['c', 1]];

// 20000 -> "20p", 4643 -> "4p 6g 4s 3c", 0 -> "".
export function formatCoin(copper: number): string {
  if (!copper) return '';
  let rem = copper;
  const parts: string[] = [];
  for (const [sym, val] of COIN) {
    const n = Math.floor(rem / val);
    if (n) parts.push(`${n}${sym}`);
    rem -= n * val;
  }
  return parts.join(' ');
}
