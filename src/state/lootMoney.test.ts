import { describe, expect, it } from 'vitest';
import { create } from '@bufbuild/protobuf';
import {
  ChatMessageSchema,
  EnvelopeSchema,
  LootTransactionSchema,
} from '@gen/seq/v1/events_pb';
import { SpawnStore } from './store';

// chatColor 286 == CC_User_Loot, the colour loot lines arrive with.
const LOOT_COLOR = 286;

function chatEnvelope(seq: bigint, text: string, chatColor = LOOT_COLOR) {
  return create(EnvelopeSchema, {
    seq,
    payload: {
      case: 'chat',
      value: create(ChatMessageSchema, { text, chatColor }),
    },
  });
}

// The daemon reads the sale amount off the wire and publishes it here, rather
// than the client matching it out of the loot line's wording.
function lootTxnEnvelope(seq: bigint, coinCopper: number) {
  return create(EnvelopeSchema, {
    seq,
    payload: {
      case: 'lootTransaction',
      value: create(LootTransactionSchema, { coinCopper, corpseId: 11979 }),
    },
  });
}

// Verbatim lines from a live capture. The wording still states an amount; the
// client must take the item name from it and nothing else.
const SOLD_3G5S7C =
  "You looted a Cloth Shirt +2 from a skeletal excavator's corpse and sold it for 3 gold, 5 silver and 7 copper.";
const LOOTED_QTY =
  "--You have looted 2 Bone Chips from a cracked skeleton's corpse.--";

const ZERO = { platinum: 0, gold: 0, silver: 0, copper: 0 };

describe('auto-sell loot lines', () => {
  it('accrues coin from the loot transaction, not the text', () => {
    const store = new SpawnStore();
    store.apply(lootTxnEnvelope(1n, 7));
    expect(store.moneyTotal()).toEqual({ ...ZERO, copper: 7 });
  });

  it('splits a copper amount back across denominations', () => {
    const store = new SpawnStore();
    store.apply(lootTxnEnvelope(1n, 7));
    store.apply(lootTxnEnvelope(2n, 43));
    store.apply(lootTxnEnvelope(3n, 357));
    // 7c + (4s 3c) + (3g 5s 7c); denominations sum without carrying.
    expect(store.moneyTotal()).toEqual({
      platinum: 0,
      gold: 3,
      silver: 9,
      copper: 17,
    });
  });

  it('records the sold item in the loot log', () => {
    const store = new SpawnStore();
    store.apply(chatEnvelope(1n, SOLD_3G5S7C));
    expect(store.lootEntries().map((e) => e.itemName)).toEqual([
      'Cloth Shirt +2',
    ]);
  });

  it('handles a quantity-prefixed bordered loot line carrying no coin', () => {
    const store = new SpawnStore();
    store.apply(chatEnvelope(1n, LOOTED_QTY));
    expect(store.lootEntries().map((e) => e.itemName)).toEqual(['Bone Chips']);
    expect(store.moneyTotal()).toEqual(ZERO);
  });

  it('never accrues coin from the sale wording itself', () => {
    // The line still states an amount; the client must ignore it entirely.
    const store = new SpawnStore();
    store.apply(chatEnvelope(1n, SOLD_3G5S7C));
    expect(store.moneyTotal()).toEqual(ZERO);
  });

  it('ignores a coinless loot transaction', () => {
    // 6 of 24 confirmations in one capture carried no proceeds.
    const store = new SpawnStore();
    store.apply(lootTxnEnvelope(1n, 0));
    expect(store.moneyTotal()).toEqual(ZERO);
  });
});
