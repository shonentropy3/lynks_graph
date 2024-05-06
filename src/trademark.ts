import {
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent
} from "../generated/trademark/trademark"
import {
  TransferBatch,
  TransferSingle,
  TrademarkBalance
} from "../generated/schema"
import { BigInt } from '@graphprotocol/graph-ts'

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

  entity.save()

  for(let i = 0; i < event.params.ids.length; i++) {
    let id = event.params.ids[i]
    let value = event.params.values[i]
    let trademarkBalanceFrom = TrademarkBalance.load(event.params.from.concatI32(id.toI32()))
    if(trademarkBalanceFrom === null) {
      trademarkBalanceFrom = new TrademarkBalance(event.params.from.concatI32(id.toI32()))
      trademarkBalanceFrom.trademark_id = id
      trademarkBalanceFrom.address = event.params.from
      trademarkBalanceFrom.balance = new BigInt(0)
    }
    trademarkBalanceFrom.balance = trademarkBalanceFrom.balance.minus(value)
    trademarkBalanceFrom.save()
  

    let trademarkBalanceTo = TrademarkBalance.load(event.params.to.concatI32(id.toI32()))
    if(trademarkBalanceTo === null) {
      trademarkBalanceTo = new TrademarkBalance(event.params.to.concatI32(id.toI32()))
      trademarkBalanceTo.trademark_id = id
      trademarkBalanceTo.address = event.params.to
      trademarkBalanceTo.balance = new BigInt(0)
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
