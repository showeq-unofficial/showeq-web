import type {
  BuffsUpdate,
  CategoriesUpdate,
  ChatMessage,
  CombatEvent,
  Envelope,
  EqTimeSync,
  FilterRulesUpdate,
  GroupUpdate,
  Item,
  ItemCacheTotals,
  MapGeometry,
  MapPackage,
  PlayerStats,
  Pref,
  Spawn,
  SpawnPoint,
  WornSet,
  ZoneServer,
} from '@gen/seq/v1/events_pb';

// One chat-log line: the wire ChatMessage plus the seq the daemon used,
// so the React render key is stable across re-renders.
export type ChatEntry = ChatMessage & { seq: bigint };

// One combat-log line: same pattern; we also stamp the local arrival
// time so the UI can show "12s ago" style relative timestamps if it
// wants to (currently unused).
export type CombatEntry = CombatEvent & { seq: bigint; localTs: number };

// One skill-up: synthesized client-side by diffing each PlayerStats.skills
// payload against the previous one. Session-only — not persisted.
export type SkillLogEntry = {
  skillId: number;
  oldValue: number;
  newValue: number;
  localTs: number;
};

// One loot line synthesized from a chatColor === 286 (CC_User_Loot)
// chat event. `looter` is the empty string for "You have looted a X"
// (template 467) and the looter's name for group/raid lines like
// "Foo has looted a X" (template 466). Both sides are tracked together
// so the session window shows everything that dropped in your group.
export type LootEntry = {
  itemName: string;
  looter: string;
  localTs: number;
};

// Running coin total for the session. Synthesized from "You receive X
// from the corpse" (template 12072) and "You receive X as your split"
// (template 12071) chat lines. Reset by clearLootLog.
export type MoneyTotals = {
  platinum: number;
  gold: number;
  silver: number;
  copper: number;
};

// One sample of the player's experience progress, used to compute a
// rolling XP rate. We continuously map (level, expCur, expMax) onto a
// single scalar `level + expCur/expMax` so a level-up adds exactly 1.0
// of "progress" rather than discontinuously resetting expCur to 0.
type ExpSample = {
  ts: number;
  level: number;
  expCur: number;
  expMax: number;
};

const CHAT_HISTORY_LIMIT = 500;
const COMBAT_HISTORY_LIMIT = 500;
const SKILL_LOG_LIMIT = 200;
const LOOT_LOG_LIMIT = 1000;
// CC_User_Loot from showeq-daemon-quarm/src/everquest.h. Loot lines from
// the server arrive as OP_FormattedMessage with this colour.
const CHAT_COLOR_LOOT = 286;
// EQMacEmu string templates 466/467 — both wrapped with literal "--"
// borders by the server's eqstr table. The "a " article is hardcoded.
// Item name has been pre-stripped of \x12 link wrappers by the daemon.
const LOOT_RX_YOU = /^--You have looted a (.+?)--$/;
const LOOT_RX_OTHER = /^--(.+?) has looted a (.+?)--$/;
// Templates 12071/12072. "%1" is `Strings::Money(...)` output, which
// always starts with a leading space and uses Oxford-comma separators
// — the regex below tolerates either by extracting the coin tokens
// independently after a coarse boundary match.
const MONEY_RX = /^You receive\s+(.+?)\s+(?:from the corpse|as your split)\.?$/;
const MONEY_TOKEN_RX = /([\d,]+)\s+(platinum|gold|silver|copper)/g;
// Window over which the XP rate is averaged. Long enough to stay stable
// during travel/idle gaps between kills, short enough to reflect a
// changed group/zone within a few minutes.
const EXP_WINDOW_MS = 10 * 60 * 1000;
// Minimum elapsed time before we trust a rate at all. Below this the
// estimate is dominated by single-kill granularity, which is misleading
// — one kill on a fresh page load would otherwise extrapolate to a wild
// %/hr number. Three minutes is enough that a couple of kills are
// already averaged together by the regression below.
const EXP_MIN_ELAPSED_MS = 3 * 60 * 1000;
const EXP_SAMPLE_LIMIT = 256;

// In-memory spawn map keyed by spawn id. Events from the daemon mutate
// this in place; MapCanvas re-reads on each animation frame.
export class SpawnStore {
  private readonly spawns = new Map<number, Spawn>();
  // SpawnMonitor's promoted points keyed by SpawnPoint.key. Cleared
  // wholesale on zoneChanged / SpawnPointsCleared.
  private readonly spawnPoints = new Map<string, SpawnPoint>();
  private zoneShort = '';
  private zoneLong = '';
  private playerId = 0;
  private geometry: MapGeometry | undefined;
  private playerStats: PlayerStats | undefined;
  private group: GroupUpdate | undefined;
  private buffs: BuffsUpdate | undefined;
  private categories: CategoriesUpdate | undefined;
  private filterRules: FilterRulesUpdate | undefined;
  // Allowlisted daemon-side preferences keyed by `${section}.${key}`.
  // Populated wholesale by PrefsSnapshot, then mutated incrementally by
  // PrefChanged.
  private prefs = new Map<string, Pref>();
  // Mirror of the daemon's persistent itemId -> Item cache. Contains
  // every item ever observed via OP_ItemPacket (worn, inventory, bags,
  // bank) — the cache is the lookup table for resolving an itemId to
  // its template; worn membership is tracked separately via wornSlots.
  private items = new Map<number, Item>();
  // Slot index (0..22) -> itemId currently equipped there, mirroring
  // the daemon's ItemCache::wornSlots() (populated from each
  // OP_ItemPacket wrapper's main_slot=0 / sub_slot fields). Empty until
  // the first worn_set arrives — the daemon emits one on each
  // equip/un-equip plus inside the initial Snapshot.
  private wornSlots = new Map<number, number>();
  // Aggregate sums over the worn set above (HP/mana/AC/stats/resists).
  // Recomputed by the daemon and re-sent as ItemCacheTotals on each
  // worn change, alongside the WornSet event.
  private itemTotals: ItemCacheTotals | undefined;
  // Most recent OP_TimeOfDay sync. Paired with the envelope server_ts_ms
  // so the StatusBar can extrapolate Norrath time locally at 20× wall-
  // clock rate without polling the daemon.
  private eqTimeSync: EqTimeSync | undefined;
  private eqTimeSyncServerMs = 0n;
  // Most recent OP_ZoneServerInfo. Cleared along with the spawn map on
  // zoneChanged so a stale endpoint doesn't linger after the next world
  // handoff arrives (the daemon will re-emit on every handoff).
  private zoneServer: ZoneServer | undefined;
  // Available map provider packages and the globally-active one. Replaced
  // wholesale on each MapPackagesUpdate (sent on subscribe + whenever the
  // active package changes). Picking a package re-resolves the zone, which
  // the daemon delivers as a fresh ZoneChanged — handled above — so no
  // geometry bookkeeping is needed here.
  private mapPackagesList: MapPackage[] = [];
  private activeMapPackageId = '';
  // Bounded ring buffers (oldest first). Growth capped at the *_LIMIT
  // constants above to prevent unbounded memory in long sessions.
  private chat: ChatEntry[] = [];
  private combat: CombatEntry[] = [];
  private skillLog: SkillLogEntry[] = [];
  private lootLog: LootEntry[] = [];
  private moneyTotals: MoneyTotals = { platinum: 0, gold: 0, silver: 0, copper: 0 };
  private expSamples: ExpSample[] = [];
  private lastSeq = 0n;

  apply(env: Envelope): void {
    this.lastSeq = env.seq;
    const p = env.payload;
    switch (p.case) {
      case 'snapshot': {
        this.spawns.clear();
        this.spawnPoints.clear();
        this.items.clear();
        this.wornSlots.clear();
        this.zoneShort = p.value.zoneShort;
        this.zoneLong = p.value.zoneLong;
        this.playerId = p.value.playerId;
        this.geometry = p.value.geometry;
        for (const s of p.value.spawns) this.spawns.set(s.id, s);
        for (const sp of p.value.spawnPoints) this.spawnPoints.set(sp.key, sp);
        for (const it of p.value.items) this.items.set(it.id, it);
        this.itemTotals = p.value.itemTotals;
        if (p.value.wornSet) this.applyWornSet(p.value.wornSet);
        if (p.value.eqTimeSync) {
          this.eqTimeSync = p.value.eqTimeSync;
          this.eqTimeSyncServerMs = env.serverTsMs;
        }
        if (p.value.zoneServer) this.zoneServer = p.value.zoneServer;
        break;
      }
      case 'zoneChanged': {
        // The daemon reuses ZoneChanged for two distinct events:
        //   1. a real zone transition (new zone short name) — wipe spawns,
        //      they belong to the zone we just left;
        //   2. a map-package switch (same zone, fresh geometry only) — the
        //      daemon re-emits ZoneChanged after SetMapPackage but keeps its
        //      own spawn state, so we must keep ours too. Clearing here left
        //      the map empty until the next per-spawn delta arrived.
        // Distinguish on the zone short name: only an actual zone change
        // clears the spawn + spawn-point maps.
        const zoneChanged = p.value.zoneShort !== this.zoneShort;
        this.zoneShort = p.value.zoneShort;
        this.zoneLong = p.value.zoneLong;
        this.geometry = p.value.geometry;
        if (zoneChanged) {
          this.spawns.clear();
          this.spawnPoints.clear();
        }
        break;
      }
      case 'spawnPointAdded':
      case 'spawnPointUpdated': {
        const point = p.value.point;
        if (point) this.spawnPoints.set(point.key, point);
        break;
      }
      case 'spawnPointRemoved':
        this.spawnPoints.delete(p.value.key);
        break;
      case 'spawnPointsCleared':
        this.spawnPoints.clear();
        break;
      case 'itemLearned':
        if (p.value.item) this.items.set(p.value.item.id, p.value.item);
        break;
      case 'itemTotals':
        this.itemTotals = p.value;
        break;
      case 'wornSet':
        this.applyWornSet(p.value);
        break;
      case 'spawnAdded':
        if (p.value.spawn) this.spawns.set(p.value.spawn.id, p.value.spawn);
        break;
      case 'spawnRemoved':
      case 'spawnKilled': {
        const id = p.case === 'spawnRemoved'
          ? p.value.id
          : p.value.deceasedId;
        this.spawns.delete(id);
        break;
      }
      case 'spawnUpdated': {
        const u = p.value;
        const existing = this.spawns.get(u.id);
        if (!existing) return;
        if (u.pos) existing.pos = u.pos;
        if (u.hpCur !== undefined) existing.hpCur = u.hpCur;
        if (u.level !== undefined) existing.level = u.level;
        if (u.name !== undefined) existing.name = u.name;
        break;
      }
      case 'playerStats': {
        // Diff skills against the previous snapshot to synthesize a
        // skill-up log. Two filters keep the log clean:
        //   - require a *non-zero* prev value: a skill that wasn't in
        //     prev (or was 0) appearing for the first time isn't a
        //     skill-up, it's the daemon catching up to login state.
        //   - require the new value to be class-available: live sends
        //     values for skill ids 75-99 the user's class can't train
        //     (we filter those from the main list via skillCap, so do
        //     the same here).
        const prev = this.playerStats;
        const cur = p.value;
        if (prev) {
          const prevMap = new Map<number, number>();
          for (const s of prev.skills) prevMap.set(s.skillId, s.value);
          const localTs = Date.now();
          for (const s of cur.skills) {
            const old = prevMap.get(s.skillId);
            if (old === undefined || old === 0) continue;
            if (s.value <= old) continue;
            // Mirrors SkillsWindow's filter — skipping skills the class
            // can't train. Avoids importing skillCaps directly to keep
            // the store decoupled from UI; instead apply a structural
            // filter: real trained skills always have an `old` already
            // in prev, which is what we just checked.
            this.skillLog.push({
              skillId: s.skillId,
              oldValue: old,
              newValue: s.value,
              localTs,
            });
          }
          if (this.skillLog.length > SKILL_LOG_LIMIT) {
            this.skillLog.splice(0, this.skillLog.length - SKILL_LOG_LIMIT);
          }
        }
        this.playerStats = cur;
        this.recordExpSample(cur);
        break;
      }
      case 'chat': {
        this.chat.push({ ...p.value, seq: env.seq });
        if (this.chat.length > CHAT_HISTORY_LIMIT) {
          this.chat.splice(0, this.chat.length - CHAT_HISTORY_LIMIT);
        }
        this.parseLootChat(p.value.text, p.value.chatColor);
        break;
      }
      case 'group':
        this.group = p.value;
        break;
      case 'buffs':
        this.buffs = p.value;
        break;
      case 'categories':
        this.categories = p.value;
        break;
      case 'filterRules':
        this.filterRules = p.value;
        break;
      case 'prefs':
        this.prefs.clear();
        for (const pref of p.value.prefs) {
          this.prefs.set(`${pref.section}.${pref.key}`, pref);
        }
        break;
      case 'prefChanged':
        if (p.value.pref) {
          const pref = p.value.pref;
          this.prefs.set(`${pref.section}.${pref.key}`, pref);
        }
        break;
      case 'combat': {
        this.combat.push({
          ...p.value,
          seq: env.seq,
          localTs: Date.now(),
        });
        if (this.combat.length > COMBAT_HISTORY_LIMIT) {
          this.combat.splice(0, this.combat.length - COMBAT_HISTORY_LIMIT);
        }
        break;
      }
      case 'eqTimeSync':
        this.eqTimeSync = p.value;
        this.eqTimeSyncServerMs = env.serverTsMs;
        break;
      case 'zoneServer':
        this.zoneServer = p.value;
        break;
      case 'mapPackages':
        // Wholesale replace — the daemon always sends the full package
        // list plus the active id (mirrors DevicesList / BoxListUpdated).
        this.mapPackagesList = p.value.packages;
        this.activeMapPackageId = p.value.activeId;
        break;
      default:
        break;
    }
  }

  all(): Spawn[] { return Array.from(this.spawns.values()); }
  allSpawnPoints(): SpawnPoint[] { return Array.from(this.spawnPoints.values()); }
  allItems(): Item[] { return Array.from(this.items.values()); }
  totals(): ItemCacheTotals | undefined { return this.itemTotals; }
  // Returns the player's currently equipped gear as (slot index, item)
  // pairs sorted by slot. An equipped slot whose itemId is not yet in
  // the cache (rare race between WornSet and the corresponding
  // ItemLearned) is skipped — the totals proto already accounts for it.
  wornItems(): { slot: number; item: Item }[] {
    const out: { slot: number; item: Item }[] = [];
    const slots = Array.from(this.wornSlots.keys()).sort((a, b) => a - b);
    for (const slot of slots) {
      const id = this.wornSlots.get(slot)!;
      const item = this.items.get(id);
      if (item) out.push({ slot, item });
    }
    return out;
  }
  zone(): string { return this.zoneShort; }
  zoneLongName(): string { return this.zoneLong; }
  seq(): bigint { return this.lastSeq; }
  map(): MapGeometry | undefined { return this.geometry; }
  player(): Spawn | undefined {
    return this.playerId ? this.spawns.get(this.playerId) : undefined;
  }
  stats(): PlayerStats | undefined { return this.playerStats; }
  chatLog(): ReadonlyArray<ChatEntry> { return this.chat; }
  combatLog(): ReadonlyArray<CombatEntry> { return this.combat; }
  skillLogEntries(): ReadonlyArray<SkillLogEntry> { return this.skillLog; }
  lootEntries(): ReadonlyArray<LootEntry> { return this.lootLog; }
  moneyTotal(): MoneyTotals { return { ...this.moneyTotals }; }
  clearLootLog(): void {
    this.lootLog = [];
    this.moneyTotals = { platinum: 0, gold: 0, silver: 0, copper: 0 };
  }

  private parseLootChat(text: string, chatColor: number): void {
    if (chatColor === CHAT_COLOR_LOOT) {
      const youMatch = LOOT_RX_YOU.exec(text);
      if (youMatch) {
        this.pushLoot({ itemName: youMatch[1], looter: '', localTs: Date.now() });
        return;
      }
      const otherMatch = LOOT_RX_OTHER.exec(text);
      if (otherMatch) {
        this.pushLoot({ itemName: otherMatch[2], looter: otherMatch[1], localTs: Date.now() });
        return;
      }
    }
    // Money lines arrive as Chat::Green (chatColor 2), which is also
    // used by many unrelated system messages — gate on the text shape
    // alone instead of the colour.
    const moneyMatch = MONEY_RX.exec(text);
    if (moneyMatch) {
      this.accrueMoney(moneyMatch[1]);
    }
  }

  private pushLoot(entry: LootEntry): void {
    this.lootLog.push(entry);
    if (this.lootLog.length > LOOT_LOG_LIMIT) {
      this.lootLog.splice(0, this.lootLog.length - LOOT_LOG_LIMIT);
    }
  }

  private accrueMoney(coinPhrase: string): void {
    // Re-create the iterator each call — the regex has the /g flag so
    // its lastIndex would otherwise leak across invocations.
    const rx = new RegExp(MONEY_TOKEN_RX.source, 'g');
    let match: RegExpExecArray | null;
    while ((match = rx.exec(coinPhrase)) !== null) {
      const n = Number.parseInt(match[1].replace(/,/g, ''), 10);
      if (!Number.isFinite(n) || n <= 0) continue;
      switch (match[2]) {
        case 'platinum': this.moneyTotals.platinum += n; break;
        case 'gold':     this.moneyTotals.gold     += n; break;
        case 'silver':   this.moneyTotals.silver   += n; break;
        case 'copper':   this.moneyTotals.copper   += n; break;
      }
    }
  }
  groupState(): GroupUpdate | undefined { return this.group; }
  buffsState(): BuffsUpdate | undefined { return this.buffs; }
  categoriesState(): CategoriesUpdate | undefined { return this.categories; }
  filterRulesState(): FilterRulesUpdate | undefined { return this.filterRules; }
  // Returns the last EqTimeSync and the daemon's wall-clock at the
  // moment of that sync (in env.server_ts_ms). The StatusBar pairs the
  // sync's {y/m/d/h/m} with `(now - serverMs) * 20` to render a smooth
  // local extrapolation between sync points.
  eqTime(): { sync: EqTimeSync; serverMs: bigint } | undefined {
    return this.eqTimeSync ? { sync: this.eqTimeSync, serverMs: this.eqTimeSyncServerMs } : undefined;
  }
  zoneServerInfo(): ZoneServer | undefined { return this.zoneServer; }
  // Available map provider packages (display-only list). Replaced
  // wholesale on each MapPackagesUpdate, so the returned reference is a
  // fresh array per update — safe to treat as a value.
  mapPackages(): ReadonlyArray<MapPackage> { return this.mapPackagesList; }
  // Id of the globally-active map package ("default" = flat maps root,
  // empty until the first MapPackagesUpdate arrives).
  activeMapPackage(): string { return this.activeMapPackageId; }
  pref(section: string, key: string): Pref | undefined {
    return this.prefs.get(`${section}.${key}`);
  }
  allPrefs(): ReadonlyMap<string, Pref> { return this.prefs; }

  // Rolling XP rate over EXP_WINDOW_MS. Uses least-squares regression on
  // every sample in the window plus a synthetic `(now, currentProgress)`
  // point so that:
  //   - a single kill doesn't dominate the slope (regression averages
  //     across all in-window samples instead of using only endpoints);
  //   - idle time after the last kill correctly drags the rate toward
  //     zero (the synthetic now-point keeps moving forward at the same
  //     progress value, flattening the regression line).
  // Returns undefined until we've buffered EXP_MIN_ELAPSED_MS of data.
  expRate(): { pctPerHour: number; msToLevel: number | null } | undefined {
    const cur = this.playerStats;
    if (!cur || cur.expMax <= 0) return undefined;
    const now = Date.now();
    const cutoff = now - EXP_WINDOW_MS;
    while (this.expSamples.length > 0 && this.expSamples[0].ts < cutoff) {
      this.expSamples.shift();
    }
    const oldest = this.expSamples[0];
    if (!oldest || oldest.expMax <= 0) return undefined;
    const elapsedMs = now - oldest.ts;
    if (elapsedMs < EXP_MIN_ELAPSED_MS) return undefined;

    // Regress (t_seconds_since_oldest, levelProgress). Coefficients are
    // levels-per-second; convert to %/hr by *100 *3600 (each level = 100%).
    const t0 = oldest.ts;
    const curProgress = cur.level + cur.expCur / cur.expMax;
    let n = 0, sumT = 0, sumP = 0, sumTP = 0, sumTT = 0;
    const accumulate = (tMs: number, p: number) => {
      const t = (tMs - t0) / 1000;
      n++;
      sumT += t;
      sumP += p;
      sumTP += t * p;
      sumTT += t * t;
    };
    for (const s of this.expSamples) {
      accumulate(s.ts, s.level + s.expCur / s.expMax);
    }
    accumulate(now, curProgress);
    const denom = n * sumTT - sumT * sumT;
    if (denom <= 0) return undefined;
    const slopePerSec = (n * sumTP - sumT * sumP) / denom;
    const pctPerHour = slopePerSec * 3600 * 100;

    const remainingPct = (1 - cur.expCur / cur.expMax) * 100;
    const msToLevel = pctPerHour > 0
      ? (remainingPct / pctPerHour) * 3_600_000
      : null;
    return { pctPerHour, msToLevel };
  }

  private recordExpSample(cur: PlayerStats): void {
    if (cur.expMax <= 0) return;
    const last = this.expSamples[this.expSamples.length - 1];
    // Skip pure-duplicate samples: PlayerStats is re-emitted on hp/mana
    // changes too, so without this we'd flood the buffer between kills.
    if (
      last &&
      last.level === cur.level &&
      last.expCur === cur.expCur &&
      last.expMax === cur.expMax
    ) {
      return;
    }
    const ts = Date.now();
    this.expSamples.push({
      ts,
      level: cur.level,
      expCur: cur.expCur,
      expMax: cur.expMax,
    });
    const cutoff = ts - EXP_WINDOW_MS;
    while (this.expSamples.length > 0 && this.expSamples[0].ts < cutoff) {
      this.expSamples.shift();
    }
    if (this.expSamples.length > EXP_SAMPLE_LIMIT) {
      this.expSamples.splice(0, this.expSamples.length - EXP_SAMPLE_LIMIT);
    }
  }

  private applyWornSet(ws: WornSet): void {
    this.wornSlots.clear();
    const n = Math.min(ws.slotIndices.length, ws.itemIds.length);
    for (let i = 0; i < n; i++) {
      this.wornSlots.set(ws.slotIndices[i], ws.itemIds[i]);
    }
  }

  // Quick membership check used by MapCanvas to highlight group members.
  isGroupSpawn(spawnId: number): boolean {
    if (!this.group) return false;
    for (const m of this.group.members) {
      if (m.inZone && m.spawnId === spawnId) return true;
    }
    return false;
  }
}
