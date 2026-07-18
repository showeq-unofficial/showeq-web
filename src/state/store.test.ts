import { describe, expect, it, vi } from 'vitest';
import { create } from '@bufbuild/protobuf';
import {
  EnvelopeSchema,
  MapPackageSchema,
  MapPackagesUpdateSchema,
  SpawnAddedSchema,
  SpawnCastSchema,
  SpawnKilledSchema,
  SnapshotSchema,
  SpawnRemovedSchema,
  SpawnSchema,
  ZoneChangedSchema,
} from '@gen/seq/v1/events_pb';
import { SpawnStore } from './store';

function spawnAddedEnvelope(seq: bigint, id: number, name: string) {
  return create(EnvelopeSchema, {
    seq,
    payload: {
      case: 'spawnAdded',
      value: create(SpawnAddedSchema, {
        spawn: create(SpawnSchema, { id, name }),
      }),
    },
  });
}

function zoneChangedEnvelope(seq: bigint, zoneShort: string, zoneLong = '') {
  return create(EnvelopeSchema, {
    seq,
    payload: {
      case: 'zoneChanged',
      value: create(ZoneChangedSchema, { zoneShort, zoneLong }),
    },
  });
}

function snapshotEnvelope(
  seq: bigint,
  zoneShort: string,
  playerId: number,
  spawns: { id: number; name: string }[],
) {
  return create(EnvelopeSchema, {
    seq,
    payload: {
      case: 'snapshot',
      value: create(SnapshotSchema, {
        zoneShort,
        playerId,
        spawns: spawns.map((s) => create(SpawnSchema, { id: s.id, name: s.name })),
      }),
    },
  });
}

// Build a server->client Envelope carrying a MapPackagesUpdate, the same
// way SeqClient builds ClientEnvelopes — via the generated schemas.
function mapPackagesEnvelope(
  seq: bigint,
  packages: { id: string; label?: string; zoneCount?: number }[],
  activeId: string,
) {
  return create(EnvelopeSchema, {
    seq,
    payload: {
      case: 'mapPackages',
      value: create(MapPackagesUpdateSchema, {
        packages: packages.map((p) =>
          create(MapPackageSchema, {
            id: p.id,
            label: p.label ?? '',
            zoneCount: p.zoneCount ?? 0,
          }),
        ),
        activeId,
      }),
    },
  });
}

describe('SpawnStore map packages', () => {
  it('starts empty', () => {
    const store = new SpawnStore();
    expect(store.mapPackages()).toEqual([]);
    expect(store.activeMapPackage()).toBe('');
  });

  it('stores packages + active id from a MapPackagesUpdate', () => {
    const store = new SpawnStore();
    store.apply(
      mapPackagesEnvelope(
        1n,
        [
          { id: 'default', label: 'Default', zoneCount: 412 },
          { id: 'brewall', label: 'Brewall', zoneCount: 380 },
        ],
        'brewall',
      ),
    );

    const pkgs = store.mapPackages();
    expect(pkgs.map((p) => p.id)).toEqual(['default', 'brewall']);
    expect(pkgs[1].label).toBe('Brewall');
    expect(pkgs[1].zoneCount).toBe(380);
    expect(store.activeMapPackage()).toBe('brewall');
  });

  it('replaces the list wholesale on each update', () => {
    const store = new SpawnStore();
    store.apply(
      mapPackagesEnvelope(
        1n,
        [{ id: 'default' }, { id: 'brewall' }, { id: 'good' }],
        'default',
      ),
    );
    expect(store.mapPackages()).toHaveLength(3);

    // A subsequent update (e.g. after SetMapPackage) replaces, not merges.
    store.apply(mapPackagesEnvelope(2n, [{ id: 'default' }], 'default'));
    expect(store.mapPackages().map((p) => p.id)).toEqual(['default']);
    expect(store.activeMapPackage()).toBe('default');
  });

  it('updates the active id when the active package changes', () => {
    const store = new SpawnStore();
    const list = [{ id: 'default' }, { id: 'brewall' }];
    store.apply(mapPackagesEnvelope(1n, list, 'default'));
    expect(store.activeMapPackage()).toBe('default');

    store.apply(mapPackagesEnvelope(2n, list, 'brewall'));
    expect(store.activeMapPackage()).toBe('brewall');
  });
});

function spawnCastEnvelope(
  seq: bigint,
  casterId: number,
  spellName: string,
  castTimeMs: number,
) {
  return create(EnvelopeSchema, {
    seq,
    payload: {
      case: 'spawnCast',
      value: create(SpawnCastSchema, {
        casterId,
        casterName: '',
        spellId: 42,
        spellName,
        castTimeMs,
      }),
    },
  });
}

function spawnRemovedEnvelope(seq: bigint, id: number) {
  return create(EnvelopeSchema, {
    seq,
    payload: {
      case: 'spawnRemoved',
      value: create(SpawnRemovedSchema, { id }),
    },
  });
}

function spawnKilledEnvelope(seq: bigint, deceasedId: number) {
  return create(EnvelopeSchema, {
    seq,
    payload: {
      case: 'spawnKilled',
      value: create(SpawnKilledSchema, { deceasedId }),
    },
  });
}

describe('SpawnStore casts', () => {
  it('tracks an in-progress cast and expires it after castTimeMs', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1000);
    try {
      const store = new SpawnStore();
      store.apply(spawnCastEnvelope(1n, 100, 'Spirit of Wolf', 3000));

      // Still casting at start and mid-cast.
      expect(store.castFor(100, 1000)?.spellName).toBe('Spirit of Wolf');
      expect(store.castFor(100, 2000)).toBeDefined();
      // Expired once castTimeMs has elapsed (started at 1000 + 3000).
      expect(store.castFor(100, 4000)).toBeUndefined();
      // Pruned lazily on that read — a later query stays undefined.
      expect(store.castFor(100, 2000)).toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it('treats castTimeMs === 0 as instant/aborted and clears a prior cast', () => {
    const store = new SpawnStore();
    // A 0ms cast on its own leaves nothing to count down.
    store.apply(spawnCastEnvelope(1n, 100, 'Nullify Magic', 0));
    expect(store.castFor(100)).toBeUndefined();

    // A 0ms cast (abort) drops an in-progress cast for the same spawn.
    store.apply(spawnCastEnvelope(2n, 100, 'Spirit of Wolf', 5000));
    expect(store.castFor(100)).toBeDefined();
    store.apply(spawnCastEnvelope(3n, 100, 'Interrupted', 0));
    expect(store.castFor(100)).toBeUndefined();
  });

  it('prunes casts on spawnRemoved, spawnKilled, and zoneChanged', () => {
    const store = new SpawnStore();

    store.apply(spawnCastEnvelope(1n, 100, 'Spirit of Wolf', 5000));
    store.apply(spawnRemovedEnvelope(2n, 100));
    expect(store.castFor(100)).toBeUndefined();

    store.apply(spawnCastEnvelope(3n, 101, 'Spirit of Wolf', 5000));
    store.apply(spawnKilledEnvelope(4n, 101));
    expect(store.castFor(101)).toBeUndefined();

    store.apply(zoneChangedEnvelope(5n, 'qeynos'));
    store.apply(spawnCastEnvelope(6n, 102, 'Spirit of Wolf', 5000));
    expect(store.castFor(102)).toBeDefined();
    store.apply(zoneChangedEnvelope(7n, 'qeynos2'));
    expect(store.castFor(102)).toBeUndefined();
  });
});

describe('SpawnStore zoneChanged', () => {
  it('clears spawns on a real zone change (different zone)', () => {
    const store = new SpawnStore();
    store.apply(zoneChangedEnvelope(1n, 'qeynos'));
    store.apply(spawnAddedEnvelope(2n, 100, 'a guard'));
    store.apply(spawnAddedEnvelope(3n, 101, 'a citizen'));
    expect(store.all()).toHaveLength(2);

    // Zoning into a different zone wipes the prior zone's spawns.
    store.apply(zoneChangedEnvelope(4n, 'qeynos2'));
    expect(store.zone()).toBe('qeynos2');
    expect(store.all()).toHaveLength(0);
  });

  it('keeps spawns on a map-package switch (same zone, new geometry)', () => {
    const store = new SpawnStore();
    store.apply(zoneChangedEnvelope(1n, 'qeynos'));
    store.apply(spawnAddedEnvelope(2n, 100, 'a guard'));
    store.apply(spawnAddedEnvelope(3n, 101, 'a citizen'));
    expect(store.all()).toHaveLength(2);

    // SetMapPackage makes the daemon re-emit ZoneChanged for the SAME zone
    // with fresh geometry — spawns must survive (regression test for the
    // map-swap-clears-spawns bug).
    store.apply(zoneChangedEnvelope(4n, 'qeynos'));
    expect(store.zone()).toBe('qeynos');
    expect(store.all()).toHaveLength(2);
  });

  it('keeps the player spawn across a zone-in clear (stale-zone snapshot)', () => {
    const store = new SpawnStore();
    // A zone-in Snapshot carries the NEW player_id but a STALE zone_short (it
    // fires on self-id adoption, before OP_NewZone resolves the new name).
    store.apply(snapshotEnvelope(1n, 'soldungb', 13167, [
      { id: 13167, name: 'Skik' },
      { id: 200, name: 'a bat' },
    ]));
    expect(store.player()?.id).toBe(13167);
    expect(store.all()).toHaveLength(2);

    // The real new-zone name lands right after → a real zone change. The
    // player's own spawn must survive so the map's self-marker + camera don't
    // blink out until the new zone re-sends it (mirrors legacy's persistent
    // m_player). Neighbours from the old zone are still cleared.
    store.apply(zoneChangedEnvelope(2n, 'lavastorm'));
    expect(store.zone()).toBe('lavastorm');
    expect(store.player()?.id).toBe(13167); // 'you' preserved
    expect(store.all()).toHaveLength(1); // only self, neighbours cleared
  });
});
