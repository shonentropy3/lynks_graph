import {
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
} from "../generated/trademark/trademark";
import {
  TransferBatch,
  TransferSingle,
  Boost2Balance,
} from "../generated/schema";
import { Bytes, BigInt, crypto } from "@graphprotocol/graph-ts";

export function handleTransferBatch(event: TransferBatchEvent): void {
  let booster2AmountTo = loadBooster2Amount(event.params.to);
  let booster2AmountFrom = loadBooster2Amount(event.params.from);

  for (let i = 0; i < event.params.ids.length; i++) {
    let id = event.params.ids[i];
    let value = event.params.values[i];
    if (id == BigInt.fromI32(50)) {
      booster2AmountTo.balance50 = booster2AmountTo.balance50.plus(value);
      booster2AmountFrom.balance50 = booster2AmountFrom.balance50.minus(value);
    } else if (id == BigInt.fromI32(100)) {
      booster2AmountTo.balance100 = booster2AmountTo.balance100.plus(value);
      booster2AmountFrom.balance100 =
        booster2AmountFrom.balance100.minus(value);
    } else if (id == BigInt.fromI32(200)) {
      booster2AmountTo.balance200 = booster2AmountTo.balance200.plus(value);
      booster2AmountFrom.balance200 =
        booster2AmountFrom.balance200.minus(value);
    } else if (id == BigInt.fromI32(500)) {
      booster2AmountTo.balance500 = booster2AmountTo.balance500.plus(value);
      booster2AmountFrom.balance500 =
        booster2AmountFrom.balance500.minus(value);
    } else if (id == BigInt.fromI32(1000)) {
      booster2AmountTo.balance1000 = booster2AmountTo.balance1000.plus(value);
      booster2AmountFrom.balance1000 =
        booster2AmountFrom.balance1000.minus(value);
    }
  }
  booster2AmountFrom.save();
  booster2AmountTo.save();
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let booster2AmountTo = loadBooster2Amount(event.params.to);
  let booster2AmountFrom = loadBooster2Amount(event.params.from);
  let value = event.params.value;
  let id = event.params.id;

  if (id == BigInt.fromI32(50)) {
    booster2AmountTo.balance50 = booster2AmountTo.balance50.plus(value);
    booster2AmountFrom.balance50 = booster2AmountFrom.balance50.minus(value);
  } else if (id == BigInt.fromI32(100)) {
    booster2AmountTo.balance100 = booster2AmountTo.balance100.plus(value);
    booster2AmountFrom.balance100 = booster2AmountFrom.balance100.minus(value);
  } else if (id == BigInt.fromI32(200)) {
    booster2AmountTo.balance200 = booster2AmountTo.balance200.plus(value);
    booster2AmountFrom.balance200 = booster2AmountFrom.balance200.minus(value);
  } else if (id == BigInt.fromI32(500)) {
    booster2AmountTo.balance500 = booster2AmountTo.balance500.plus(value);
    booster2AmountFrom.balance500 = booster2AmountFrom.balance500.minus(value);
  } else if (id == BigInt.fromI32(1000)) {
    booster2AmountTo.balance1000 = booster2AmountTo.balance1000.plus(value);
    booster2AmountFrom.balance1000 =
      booster2AmountFrom.balance1000.minus(value);
  }
  booster2AmountFrom.save();
  booster2AmountTo.save();
}

export function loadBooster2Amount(address: Bytes): Boost2Balance {
  const id = Bytes.fromByteArray(crypto.keccak256(address));
  let boost2Balance = Boost2Balance.load(id);
  if (!boost2Balance) {
    boost2Balance = new Boost2Balance(id);
    boost2Balance.address = address;
    boost2Balance.balance50 = BigInt.fromI32(0);
    boost2Balance.balance100 = BigInt.fromI32(0);
    boost2Balance.balance200 = BigInt.fromI32(0);
    boost2Balance.balance500 = BigInt.fromI32(0);
    boost2Balance.balance1000 = BigInt.fromI32(0);
    // trademarkAmount.save();
    boost2Balance.save();
  }
  return boost2Balance;
}
