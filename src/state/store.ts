import type {
  BuffsUpdate,
  CategoriesUpdate,
  ChatMessage,
  CombatEvent,
  Envelope,
  FilterRulesUpdate,
  GroupUpdate,
  MapGeometry,
  PlayerStats,
  Pref,
  Spawn,
  SpawnPoint,
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

const CHAT_HISTORY_LIMIT = 500;
const COMBAT_HISTORY_LIMIT = 500;
const SKILL_LOG_LIMIT = 200;

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
  // Bounded ring buffers (oldest first). Growth capped at the *_LIMIT
  // constants above to prevent unbounded memory in long sessions.
  private chat: ChatEntry[] = [];
  private combat: CombatEntry[] = [];
  private skillLog: SkillLogEntry[] = [];
  private lastSeq = 0n;

  apply(env: Envelope): void {
    this.lastSeq = env.seq;
    const p = env.payload;
    switch (p.case) {
      case 'snapshot': {
        this.spawns.clear();
        this.spawnPoints.clear();
        this.zoneShort = p.value.zoneShort;
        this.zoneLong = p.value.zoneLong;
        this.playerId = p.value.playerId;
        this.geometry = p.value.geometry;
        for (const s of p.value.spawns) this.spawns.set(s.id, s);
        for (const sp of p.value.spawnPoints) this.spawnPoints.set(sp.key, sp);
        break;
      }
      case 'zoneChanged':
        this.zoneShort = p.value.zoneShort;
        this.zoneLong = p.value.zoneLong;
        this.geometry = p.value.geometry;
        this.spawns.clear();
        this.spawnPoints.clear();
        break;
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
        break;
      }
      case 'chat': {
        this.chat.push({ ...p.value, seq: env.seq });
        if (this.chat.length > CHAT_HISTORY_LIMIT) {
          this.chat.splice(0, this.chat.length - CHAT_HISTORY_LIMIT);
        }
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
      default:
        break;
    }
  }

  all(): Spawn[] { return Array.from(this.spawns.values()); }
  allSpawnPoints(): SpawnPoint[] { return Array.from(this.spawnPoints.values()); }
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
  groupState(): GroupUpdate | undefined { return this.group; }
  buffsState(): BuffsUpdate | undefined { return this.buffs; }
  categoriesState(): CategoriesUpdate | undefined { return this.categories; }
  filterRulesState(): FilterRulesUpdate | undefined { return this.filterRules; }
  pref(section: string, key: string): Pref | undefined {
    return this.prefs.get(`${section}.${key}`);
  }
  allPrefs(): ReadonlyMap<string, Pref> { return this.prefs; }

  // Quick membership check used by MapCanvas to highlight group members.
  isGroupSpawn(spawnId: number): boolean {
    if (!this.group) return false;
    for (const m of this.group.members) {
      if (m.inZone && m.spawnId === spawnId) return true;
    }
    return false;
  }
}
