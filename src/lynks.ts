import {
  Transfer as TransferEvent
} from "../generated/lynks/lynks"
import {
  Transfer,
  LynksBalance
} from "../generated/schema"
import { Bytes, crypto, BigInt } from "@graphprotocol/graph-ts";

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
  
  let fromBalance = loadLynksBalance(event.params.from)
  fromBalance.balance  = fromBalance.balance.minus(BigInt.fromI32(1));
  fromBalance.save();

  let toBalance = loadLynksBalance(event.params.to)
  toBalance.balance = toBalance.balance.plus(BigInt.fromI32(1));
  toBalance.save();

  entity.save()
}

export function loadLynksBalance(address: Bytes): LynksBalance {
  const id = Bytes.fromByteArray(
    crypto.keccak256(address)
  );
  let lynksBalance = LynksBalance.load(id);
  if (!lynksBalance) {
    lynksBalance = new LynksBalance(id);
    lynksBalance.address = address;
    lynksBalance.balance = BigInt.fromI32(0);
    lynksBalance.save();
  }
  return lynksBalance;

}
