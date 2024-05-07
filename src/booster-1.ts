import {
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent
} from "../generated/booster_1/booster_1"
import {
  TransferBatch,
  TransferSingle,
  Boost1Balance,
  Boost2Balance
} from "../generated/schema"

import { Bytes, BigInt, crypto } from "@graphprotocol/graph-ts";

export function handleTransferBatch(event: TransferBatchEvent): void {
  let entity = new TransferBatch(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.from = event.params.from
  entity.to = event.params.to
  entity.ids = event.params.ids
  entity.values = event.params.values

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  for(let i = 0; i < event.params.ids.length; i++) {
    let id = event.params.ids[i]
    let value = event.params.values[i]
    let booster1Amount1 = loadBooster1Amount(event.params.to)
  let booster2Amount1 = loadBooster2Amount(event.params.to)

    if(id == BigInt.fromI32(3)) {
      booster1Amount1.balance3 = booster1Amount1.balance3.plus(value)
    }
    if(id == BigInt.fromI32(4)) {
      booster1Amount1.balance4 = booster1Amount1.balance4.plus(value)
    }
    if(id == BigInt.fromI32(50)) {
      booster2Amount1.balance50 = booster2Amount1.balance50.plus(value)
    }
    if(id == BigInt.fromI32(100)) {
      booster1Amount1.balance100 = booster1Amount1.balance100.plus(value)
      booster2Amount1.balance100 = booster2Amount1.balance100.plus(value)
    }
    if(id == BigInt.fromI32(200)) {
      booster2Amount1.balance200 = booster2Amount1.balance200.plus(value)
    }
    if(id == BigInt.fromI32(300)) {
      booster1Amount1.balance300 = booster1Amount1.balance300.plus(value)
    }
    if(id == BigInt.fromI32(500)) {
      booster1Amount1.balance500 = booster1Amount1.balance500.plus(value)
      booster2Amount1.balance500 = booster2Amount1.balance500.plus(value)
    }
    if(id == BigInt.fromI32(1000)) {
      booster1Amount1.balance1000 = booster1Amount1.balance1000.plus(value)
      booster2Amount1.balance1000 = booster2Amount1.balance1000.plus(value)
    }
    if(id == BigInt.fromI32(2000)) {
      booster1Amount1.balance2000 = booster1Amount1.balance2000.plus(value)
    }
    booster1Amount1.save()
    booster2Amount1.save()

    let booster1Amount2 = loadBooster1Amount(event.params.from)
    let booster2Amount2 = loadBooster2Amount(event.params.from)

    if(id == BigInt.fromI32(3)) {
      booster1Amount2.balance3 = booster1Amount2.balance3.minus(value)
    }
    if(id == BigInt.fromI32(4)) {
      booster1Amount2.balance4 = booster1Amount2.balance4.minus(value)
    }
    if(id == BigInt.fromI32(50)) {
      booster2Amount2.balance50 = booster2Amount2.balance50.minus(value)
    }
    if(id == BigInt.fromI32(100)) {
      booster1Amount2.balance100 = booster1Amount2.balance100.minus(value)
      booster2Amount2.balance100 = booster2Amount2.balance100.minus(value)
    }
    if(id == BigInt.fromI32(200)) {
      booster2Amount2.balance200 = booster2Amount2.balance200.minus(value)
    }
    if(id == BigInt.fromI32(300)) {
      booster1Amount2.balance300 = booster1Amount2.balance300.minus(value)
    }
    if(id == BigInt.fromI32(500)) {
      booster1Amount2.balance500 = booster1Amount2.balance500.minus(value)
      booster2Amount2.balance500 = booster2Amount2.balance500.minus(value)
    }
    if(id == BigInt.fromI32(1000)) {
      booster1Amount2.balance1000 = booster1Amount2.balance1000.plus(value)
      booster2Amount2.balance1000 = booster2Amount2.balance1000.plus(value)
    }
    if(id == BigInt.fromI32(2000)) {
      booster1Amount2.balance2000 = booster1Amount2.balance2000.plus(value)
    }
    booster1Amount2.save()
    booster2Amount2.save()
  }

  entity.save()
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let entity = new TransferSingle(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.from = event.params.from
  entity.to = event.params.to
  entity.trademark_id = event.params.id
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let value = event.params.value
  let id = event.params.id

  let booster1Amount1 = loadBooster1Amount(event.params.to)
  let booster2Amount1 = loadBooster2Amount(event.params.to)

    if(id == BigInt.fromI32(3)) {
      booster1Amount1.balance3 = booster1Amount1.balance3.plus(value)
    }
    if(id == BigInt.fromI32(4)) {
      booster1Amount1.balance4 = booster1Amount1.balance4.plus(value)
    }
    if(id == BigInt.fromI32(50)) {
      booster2Amount1.balance50 = booster2Amount1.balance50.plus(value)
    }
    if(id == BigInt.fromI32(100)) {
      booster1Amount1.balance100 = booster1Amount1.balance100.plus(value)
      booster2Amount1.balance100 = booster2Amount1.balance100.plus(value)
    }
    if(id == BigInt.fromI32(200)) {
      booster2Amount1.balance200 = booster2Amount1.balance200.plus(value)
    }
    if(id == BigInt.fromI32(300)) {
      booster1Amount1.balance300 = booster1Amount1.balance300.plus(value)
    }
    if(id == BigInt.fromI32(500)) {
      booster1Amount1.balance500 = booster1Amount1.balance500.plus(value)
      booster2Amount1.balance500 = booster2Amount1.balance500.plus(value)
    }
    if(id == BigInt.fromI32(1000)) {
      booster1Amount1.balance1000 = booster1Amount1.balance1000.plus(value)
      booster2Amount1.balance1000 = booster2Amount1.balance1000.plus(value)
    }
    if(id == BigInt.fromI32(2000)) {
      booster1Amount1.balance2000 = booster1Amount1.balance2000.plus(value)
    }
    booster1Amount1.save()
    booster2Amount1.save()

    let booster1Amount2 = loadBooster1Amount(event.params.from)
    let booster2Amount2 = loadBooster2Amount(event.params.from)

    if(id == BigInt.fromI32(3)) {
      booster1Amount2.balance3 = booster1Amount2.balance3.minus(value)
    }
    if(id == BigInt.fromI32(4)) {
      booster1Amount2.balance4 = booster1Amount2.balance4.minus(value)
    }
    if(id == BigInt.fromI32(50)) {
      booster2Amount2.balance50 = booster2Amount2.balance50.minus(value)
    }
    if(id == BigInt.fromI32(100)) {
      booster1Amount2.balance100 = booster1Amount2.balance100.minus(value)
      booster2Amount2.balance100 = booster2Amount2.balance100.minus(value)
    }
    if(id == BigInt.fromI32(200)) {
      booster2Amount2.balance200 = booster2Amount2.balance200.minus(value)
    }
    if(id == BigInt.fromI32(300)) {
      booster1Amount2.balance300 = booster1Amount2.balance300.minus(value)
    }
    if(id == BigInt.fromI32(500)) {
      booster1Amount2.balance500 = booster1Amount2.balance500.minus(value)
      booster2Amount2.balance500 = booster2Amount2.balance500.minus(value)
    }
    if(id == BigInt.fromI32(1000)) {
      booster1Amount2.balance1000 = booster1Amount2.balance1000.plus(value)
      booster2Amount2.balance1000 = booster2Amount2.balance1000.plus(value)
    }
    if(id == BigInt.fromI32(2000)) {
      booster1Amount2.balance2000 = booster1Amount2.balance2000.plus(value)
    }
    booster1Amount2.save()
    booster2Amount2.save()
}

export function loadBooster1Amount(address: Bytes): Boost1Balance{
  const id = Bytes.fromByteArray(
    crypto.keccak256(address)
  );
  let boost1Balance = Boost1Balance.load(id)
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
    // trademarkAmount.save();
    boost1Balance.save()
  }
  return boost1Balance;
}

export function loadBooster2Amount(address: Bytes): Boost2Balance{
  const id = Bytes.fromByteArray(
    crypto.keccak256(address)
  );
  let boost2Balance = Boost2Balance.load(id)
  if (!boost2Balance) {
    boost2Balance = new Boost2Balance(id);
    boost2Balance.address = address;
    boost2Balance.balance50 = BigInt.fromI32(0);
    boost2Balance.balance100 = BigInt.fromI32(0);
    boost2Balance.balance200 = BigInt.fromI32(0);
    boost2Balance.balance500 = BigInt.fromI32(0);
    boost2Balance.balance1000 = BigInt.fromI32(0);
    // trademarkAmount.save();
    boost2Balance.save()
  }
  return boost2Balance;
}