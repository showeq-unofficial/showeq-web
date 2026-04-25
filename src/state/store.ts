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
} from '@gen/seq/v1/events_pb';

// One chat-log line: the wire ChatMessage plus the seq the daemon used,
// so the React render key is stable across re-renders.
export type ChatEntry = ChatMessage & { seq: bigint };

// One combat-log line: same pattern; we also stamp the local arrival
// time so the UI can show "12s ago" style relative timestamps if it
// wants to (currently unused).
export type CombatEntry = CombatEvent & { seq: bigint; localTs: number };

const CHAT_HISTORY_LIMIT = 500;
const COMBAT_HISTORY_LIMIT = 500;

// In-memory spawn map keyed by spawn id. Events from the daemon mutate
// this in place; MapCanvas re-reads on each animation frame.
export class SpawnStore {
  private readonly spawns = new Map<number, Spawn>();
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
  private lastSeq = 0n;

  apply(env: Envelope): void {
    this.lastSeq = env.seq;
    const p = env.payload;
    switch (p.case) {
      case 'snapshot': {
        this.spawns.clear();
        this.zoneShort = p.value.zoneShort;
        this.zoneLong = p.value.zoneLong;
        this.playerId = p.value.playerId;
        this.geometry = p.value.geometry;
        for (const s of p.value.spawns) this.spawns.set(s.id, s);
        break;
      }
      case 'zoneChanged':
        this.zoneShort = p.value.zoneShort;
        this.zoneLong = p.value.zoneLong;
        this.geometry = p.value.geometry;
        this.spawns.clear();
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
      case 'playerStats':
        this.playerStats = p.value;
        break;
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
