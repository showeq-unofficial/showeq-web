import { describe, expect, it } from 'vitest';
import { create } from '@bufbuild/protobuf';
import { ChatMessageSchema, EnvelopeSchema } from '@gen/seq/v1/events_pb';
import { SpawnStore } from './store';

// chatColor 286 == CC_User_Loot, the colour loot lines arrive with.
const LOOT_COLOR = 286;

function chatEnvelope(
  seq: bigint,
  text: string,
  coinCopper = 0,
  chatColor = LOOT_COLOR,
) {
  return create(EnvelopeSchema, {
    seq,
    payload: {
      case: 'chat',
      value: create(ChatMessageSchema, { text, chatColor, coinCopper }),
    },
  });
}

// Verbatim lines from a live capture, with the coin_copper the daemon parses
// out of each. Servers that auto-sell loot report item and proceeds together.
const SOLD_7C =
  "You looted a Rat Whiskers from a large plague rat's corpse and sold it for 7 copper.";
const SOLD_4S3C =
  "You looted a Rusty Broad Sword +2 from a putrid skeleton's corpse and sold it for 4 silver and 3 copper.";
const SOLD_3G5S7C =
  "You looted a Cloth Shirt +2 from a skeletal excavator's corpse and sold it for 3 gold, 5 silver and 7 copper.";
const LOOTED_QTY =
  "--You have looted 2 Bone Chips from a cracked skeleton's corpse.--";

const ZERO = { platinum: 0, gold: 0, silver: 0, copper: 0 };

describe('auto-sell loot lines', () => {
  it('accrues coin from the envelope field, not the text', () => {
    const store = new SpawnStore();
    store.apply(chatEnvelope(1n, SOLD_7C, 7));
    expect(store.moneyTotal()).toEqual({ ...ZERO, copper: 7 });
  });

  it('splits a copper amount back across denominations', () => {
    const store = new SpawnStore();
    store.apply(chatEnvelope(1n, SOLD_7C, 7));
    store.apply(chatEnvelope(2n, SOLD_4S3C, 43));
    store.apply(chatEnvelope(3n, SOLD_3G5S7C, 357));
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
    store.apply(chatEnvelope(1n, SOLD_3G5S7C, 357));
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

  it('does not accrue from sale wording when the field is absent', () => {
    const store = new SpawnStore();
    store.apply(chatEnvelope(1n, SOLD_3G5S7C, 0));
    expect(store.moneyTotal()).toEqual(ZERO);
  });

  it('trusts the field regardless of chat colour', () => {
    // The daemon only sets coin_copper on real sales, so the colour gate
    // applies to item-name parsing, not to the coin itself.
    const store = new SpawnStore();
    store.apply(chatEnvelope(1n, SOLD_7C, 7, 4));
    expect(store.moneyTotal()).toEqual({ ...ZERO, copper: 7 });
  });
});
