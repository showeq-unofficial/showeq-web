import { describe, expect, it } from 'vitest';
import { create } from '@bufbuild/protobuf';
import {
  EnvelopeSchema,
  MapPackageSchema,
  MapPackagesUpdateSchema,
} from '@gen/seq/v1/events_pb';
import { SpawnStore } from './store';

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
