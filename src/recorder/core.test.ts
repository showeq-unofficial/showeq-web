import { describe, it, expect } from 'vitest';
import { create } from '@bufbuild/protobuf';
import { EnvelopeSchema } from '@gen/seq/v1/events_pb';
import { LootRecorderCore } from './core';
import type { LootRow } from './loot';

function env(payload: any) {
  return create(EnvelopeSchema, { payload });
}

function newCore() {
  const rows: LootRow[] = [];
  const core = new LootRecorderCore({ write: (r) => rows.push(...r) });
  return { core, rows };
}

describe('LootRecorderCore', () => {
  it('defers a message row and enriches it from its LootTransaction', () => {
    const { core, rows } = newCore();
    core.applyEnvelope(env({ case: 'zoneChanged', value: { zoneShort: 'permafrost_eqlraidgroup' } }));
    core.applyEnvelope(env({ case: 'chat', value: {
      chatColor: 286,
      text: "You looted a Cracked Paineel Shield from a wanderer's corpse and sold it for 20 platinum.",
    } }));
    expect(rows.length).toBe(0);   // held pending its transaction
    core.applyEnvelope(env({ case: 'lootTransaction', value: {
      corpseId: 12564, itemId: 1075, quantity: 1, coinCopper: 20000,
    } }));
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      source: 'message', itemName: 'Cracked Paineel Shield', mobName: 'a wanderer',
      itemId: 1075, corpseId: 12564, qty: 1, moneyCopper: 20000, sold: 1,
      disposition: 'sold', zoneBase: 'permafrost', instance: 'eqlraidgroup',
    });
  });

  it('flushes an un-transacted message when the next message arrives, and on flush()', () => {
    const { core, rows } = newCore();
    core.applyEnvelope(env({ case: 'chat', value: {
      chatColor: 286, text: "--You have looted a Dragon Bone Bracelet from Lady Vox's corpse.--",
    } }));
    core.applyEnvelope(env({ case: 'chat', value: {
      chatColor: 286, text: "--You have looted a Pearl Necklace from a fallen erudite's corpse.--",
    } }));
    expect(rows).toHaveLength(1);   // first flushed when the second arrived
    expect(rows[0]).toMatchObject({ itemName: 'Dragon Bone Bracelet', itemId: null, disposition: 'inventory' });
    core.flush();
    expect(rows).toHaveLength(2);
    expect(rows[1]).toMatchObject({ itemName: 'Pearl Necklace' });
  });

  it('records window items immediately with their link item_id', () => {
    const { core, rows } = newCore();
    core.applyEnvelope(env({ case: 'lootDrops', value: {
      corpseId: 11613, corpseName: 'an ice giant',
      items: [{ name: 'Diamond Dust', icon: 1075, itemId: 16884 }],
    } }));
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ source: 'window', itemName: 'Diamond Dust', icon: 1075, itemId: 16884, corpseId: 11613 });
  });

  it('ignores a transaction with no pending message', () => {
    const { core, rows } = newCore();
    core.applyEnvelope(env({ case: 'lootTransaction', value: { corpseId: 1, itemId: 2, quantity: 1, coinCopper: 0 } }));
    expect(rows).toHaveLength(0);
  });
});
