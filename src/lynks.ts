import {
  Transfer as TransferEvent
} from "../generated/lynks/lynks"
import {
  Transfer,
  LynksBalance
} from "../generated/schema"
import { BigInt } from '@graphprotocol/graph-ts'
export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let fromBalance = LynksBalance.load(event.params.from)
  if(fromBalance === null) {
    fromBalance = new LynksBalance(event.params.from)
    fromBalance.address = event.params.from;
    fromBalance.balance = new BigInt(0);
  }
  fromBalance.balance  = fromBalance.balance.minus(new BigInt(1));
  fromBalance.save();

  let toBalance = LynksBalance.load(event.params.to)
  if(toBalance === null) {
    toBalance = new LynksBalance(event.params.to)
    toBalance.address = event.params.to;
    toBalance.balance = new BigInt(0);
  }
  toBalance.balance = toBalance.balance.plus(new BigInt(1));
  toBalance.save();
  
}
