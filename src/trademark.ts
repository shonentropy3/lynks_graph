import {
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent
} from "../generated/trademark/trademark"
import {
  TransferBatch,
  TransferSingle,
  TrademarkBalance,
  TransferBatchMint,
  TransferBatchBuy,
  TransferSingleMint,
  TransferSingleBuy
} from "../generated/schema"
import { Bytes, crypto, BigInt } from "@graphprotocol/graph-ts";

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

  let transferBatchMint = new TransferBatchMint(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
//0x128adCD896f1982862dA3cE5977BD5152447cb02
  if(entity.from == Bytes.fromHexString("0x0000000000000000000000000000000000000000")){
    transferBatchMint.operator = event.params.operator
    transferBatchMint.from = event.params.from
    transferBatchMint.to = event.params.to
    transferBatchMint.ids = event.params.ids
    transferBatchMint.values = event.params.values
  
    transferBatchMint.blockNumber = event.block.number
    transferBatchMint.blockTimestamp = event.block.timestamp
    transferBatchMint.transactionHash = event.transaction.hash
  }

  let transferBatchBuy = new TransferBatchBuy(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
//0x128adCD896f1982862dA3cE5977BD5152447cb02
  if(entity.from == Bytes.fromHexString("0x128adCD896f1982862dA3cE5977BD5152447cb02")){
    transferBatchBuy.operator = event.params.operator
    transferBatchBuy.from = event.params.from
    transferBatchBuy.to = event.params.to
    transferBatchBuy.ids = event.params.ids
    transferBatchBuy.values = event.params.values
  
    transferBatchBuy.blockNumber = event.block.number
    transferBatchBuy.blockTimestamp = event.block.timestamp
    transferBatchBuy.transactionHash = event.transaction.hash
  }

  transferBatchMint.save()
  transferBatchBuy.save()

  entity.save()


  for(let i = 0; i < event.params.ids.length; i++) {
    let id = event.params.ids[i]
    let value = event.params.values[i]
    let trademarkBalanceFrom = TrademarkBalance.load(event.params.from.concatI32(id.toI32()))
    if(trademarkBalanceFrom === null) {
      trademarkBalanceFrom = new TrademarkBalance(event.params.from.concatI32(id.toI32()))
      trademarkBalanceFrom.trademark_id = id
      trademarkBalanceFrom.address = event.params.from
      trademarkBalanceFrom.balance = BigInt.fromI32(0);
    }
    trademarkBalanceFrom.balance = trademarkBalanceFrom.balance.minus(value)
    trademarkBalanceFrom.save()
  

    let trademarkBalanceTo = TrademarkBalance.load(event.params.to.concatI32(id.toI32()))
    if(trademarkBalanceTo === null) {
      trademarkBalanceTo = new TrademarkBalance(event.params.to.concatI32(id.toI32()))
      trademarkBalanceTo.trademark_id = id
      trademarkBalanceTo.address = event.params.to
      trademarkBalanceTo.balance = BigInt.fromI32(0);
    }
    trademarkBalanceTo.balance = trademarkBalanceTo.balance.plus(value)
    trademarkBalanceTo.save()
}
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

  let transferSingleMint = new TransferSingleMint(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
//0x128adCD896f1982862dA3cE5977BD5152447cb02
  if(entity.from == Bytes.fromHexString("0x0000000000000000000000000000000000000000")){
    transferSingleMint.operator = event.params.operator
    transferSingleMint.from = event.params.from
    transferSingleMint.to = event.params.to
    transferSingleMint.trademark_id = event.params.id
    transferSingleMint.value = event.params.value

    transferSingleMint.blockNumber = event.block.number
    transferSingleMint.blockTimestamp = event.block.timestamp
    transferSingleMint.transactionHash = event.transaction.hash
  }

  let transferSingleBuy = new TransferSingleBuy(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
//0x128adCD896f1982862dA3cE5977BD5152447cb02
  if(entity.from == Bytes.fromHexString("0x128adCD896f1982862dA3cE5977BD5152447cb02")){
    transferSingleBuy.operator = event.params.operator
    transferSingleBuy.from = event.params.from
    transferSingleBuy.to = event.params.to
    transferSingleBuy.trademark_id = event.params.id
    transferSingleBuy.value = event.params.value

    transferSingleBuy.blockNumber = event.block.number
    transferSingleBuy.blockTimestamp = event.block.timestamp
    transferSingleBuy.transactionHash = event.transaction.hash
  }

  transferSingleMint.save()
  transferSingleBuy.save()

  let trademarkBalanceFrom = TrademarkBalance.load(event.params.from.concatI32(event.params.id.toI32()))
  if(trademarkBalanceFrom === null) {
    trademarkBalanceFrom = new TrademarkBalance(event.params.from.concatI32(event.params.id.toI32()))
    trademarkBalanceFrom.trademark_id = event.params.id
    trademarkBalanceFrom.address = event.params.from
    trademarkBalanceFrom.balance = new BigInt(0)
  }
  trademarkBalanceFrom.balance = trademarkBalanceFrom.balance.minus(event.params.value)
  trademarkBalanceFrom.save()

  let trademarkBalanceTo = TrademarkBalance.load(event.params.to.concatI32(event.params.id.toI32()))
  if(trademarkBalanceTo === null) {
    trademarkBalanceTo = new TrademarkBalance(event.params.to.concatI32(event.params.id.toI32()))
    trademarkBalanceTo.trademark_id = event.params.id
    trademarkBalanceTo.address = event.params.to
    trademarkBalanceTo.balance = new BigInt(0)
  }
  trademarkBalanceTo.balance = trademarkBalanceTo.balance.plus(event.params.value)
  trademarkBalanceTo.save()
}
