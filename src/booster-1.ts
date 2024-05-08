import {
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
} from "../generated/booster_1/trademark";
import {
  TransferBatch,
  TransferSingle,
  Boost1Balance,
} from "../generated/schema";

import { Bytes, BigInt, crypto } from "@graphprotocol/graph-ts";

export function handleTransferBatch(event: TransferBatchEvent): void {
  let booster1Amount1 = loadBooster1Amount(event.params.to);
  let booster1Amount2 = loadBooster1Amount(event.params.from);
  for (let i = 0; i < event.params.ids.length; i++) {
    let id = event.params.ids[i];
    let value = event.params.values[i];

    if (id == BigInt.fromI32(3)) {
      booster1Amount1.balance3 = booster1Amount1.balance3.plus(value);
      booster1Amount2.balance3 = booster1Amount2.balance3.minus(value);
    } else if (id == BigInt.fromI32(4)) {
      booster1Amount1.balance4 = booster1Amount1.balance4.plus(value);
      booster1Amount2.balance4 = booster1Amount2.balance4.minus(value);
    } else if (id == BigInt.fromI32(100)) {
      booster1Amount1.balance100 = booster1Amount1.balance100.plus(value);
      booster1Amount2.balance100 = booster1Amount2.balance100.minus(value);
    } else if (id == BigInt.fromI32(300)) {
      booster1Amount1.balance300 = booster1Amount1.balance300.plus(value);
      booster1Amount2.balance300 = booster1Amount2.balance300.minus(value);
    } else if (id == BigInt.fromI32(500)) {
      booster1Amount1.balance500 = booster1Amount1.balance500.plus(value);
      booster1Amount2.balance500 = booster1Amount2.balance500.minus(value);
    } else if (id == BigInt.fromI32(1000)) {
      booster1Amount1.balance1000 = booster1Amount1.balance1000.plus(value);
      booster1Amount2.balance1000 = booster1Amount2.balance1000.minus(value);
    } else if (id == BigInt.fromI32(2000)) {
      booster1Amount1.balance2000 = booster1Amount1.balance2000.plus(value);
      booster1Amount2.balance2000 = booster1Amount2.balance2000.minus(value);
    }
  }
  booster1Amount1.save();
  booster1Amount2.save();
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let value = event.params.value;
  let id = event.params.id;

  let booster1Amount1 = loadBooster1Amount(event.params.to);
  let booster1Amount2 = loadBooster1Amount(event.params.from);

  if (id == BigInt.fromI32(3)) {
    booster1Amount1.balance3 = booster1Amount1.balance3.plus(value);
    booster1Amount2.balance3 = booster1Amount2.balance3.minus(value);
  } else if (id == BigInt.fromI32(4)) {
    booster1Amount1.balance4 = booster1Amount1.balance4.plus(value);
    booster1Amount2.balance4 = booster1Amount2.balance4.minus(value);
  } else if (id == BigInt.fromI32(100)) {
    booster1Amount1.balance100 = booster1Amount1.balance100.plus(value);
    booster1Amount2.balance100 = booster1Amount2.balance100.minus(value);
  } else if (id == BigInt.fromI32(300)) {
    booster1Amount1.balance300 = booster1Amount1.balance300.plus(value);
    booster1Amount2.balance300 = booster1Amount2.balance300.minus(value);
  } else if (id == BigInt.fromI32(500)) {
    booster1Amount1.balance500 = booster1Amount1.balance500.plus(value);
    booster1Amount2.balance500 = booster1Amount2.balance500.minus(value);
  } else if (id == BigInt.fromI32(1000)) {
    booster1Amount1.balance1000 = booster1Amount1.balance1000.plus(value);
    booster1Amount2.balance1000 = booster1Amount2.balance1000.minus(value);
  } else if (id == BigInt.fromI32(2000)) {
    booster1Amount1.balance2000 = booster1Amount1.balance2000.plus(value);
    booster1Amount2.balance2000 = booster1Amount2.balance2000.minus(value);
  }
  booster1Amount1.save();
  booster1Amount2.save();
}

export function loadBooster1Amount(address: Bytes): Boost1Balance {
  const id = Bytes.fromByteArray(crypto.keccak256(address));
  let boost1Balance = Boost1Balance.load(id);
  if (!boost1Balance) {
    boost1Balance = new Boost1Balance(id);
    boost1Balance.address = address;
    boost1Balance.balance3 = BigInt.fromI32(0);
    boost1Balance.balance4 = BigInt.fromI32(0);
    boost1Balance.balance100 = BigInt.fromI32(0);
    boost1Balance.balance300 = BigInt.fromI32(0);
    boost1Balance.balance500 = BigInt.fromI32(0);
    boost1Balance.balance1000 = BigInt.fromI32(0);
    boost1Balance.balance2000 = BigInt.fromI32(0);
    boost1Balance.save();
  }
  return boost1Balance;
}
