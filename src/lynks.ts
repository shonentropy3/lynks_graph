import {
  Transfer as TransferEvent
} from "../generated/lynks/lynks"
import {
  Transfer,
  LynksBalance,
  TransferMint,
  TransferBuy
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

//0x128adCD896f1982862dA3cE5977BD5152447cb02
  if(entity.from == Bytes.fromHexString("0x0000000000000000000000000000000000000000")){
    let transferMint = loadTransferMint(event.transaction.hash, event.params.from, event.params.to, event.params.tokenId, event.block.number, event.block.timestamp);
    transferMint.from = event.params.from
    transferMint.to = event.params.to
    transferMint.tokenId = event.params.tokenId

    transferMint.blockNumber = event.block.number
    transferMint.blockTimestamp = event.block.timestamp
    transferMint.transactionHash = event.transaction.hash
    transferMint.save()
  }

  if(entity.from == Bytes.fromHexString("0x128adCD896f1982862dA3cE5977BD5152447cb02")){
    let transferBuy = loadTransferBuy(event.transaction.hash, event.params.from, event.params.to, event.params.tokenId, event.block.number, event.block.timestamp);
    transferBuy.from = event.params.from
    transferBuy.to = event.params.to
    transferBuy.tokenId = event.params.tokenId

    transferBuy.blockNumber = event.block.number
    transferBuy.blockTimestamp = event.block.timestamp
    transferBuy.transactionHash = event.transaction.hash
    transferBuy.save()
  }
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

export function loadTransferMint(transactionHash: Bytes, 
  from: Bytes, to: Bytes, tokenId: BigInt, 
  blockNumber: BigInt,
  blockTimestamp: BigInt): TransferMint {
  const id = Bytes.fromByteArray(
    crypto.keccak256(transactionHash)
  );
  let transferMint = TransferMint.load(id);
  if (!transferMint) {
  transferMint = new TransferMint(id);
  transferMint.from = from
  transferMint.to = to
  transferMint.tokenId = tokenId

  transferMint.blockNumber = blockNumber
  transferMint.blockTimestamp = blockTimestamp
  transferMint.transactionHash = transactionHash
  transferMint.save();
  }
  return transferMint;
}

export function loadTransferBuy(transactionHash: Bytes, 
  from: Bytes, to: Bytes, tokenId: BigInt, 
  blockNumber: BigInt,
  blockTimestamp: BigInt): TransferBuy {
  const id = Bytes.fromByteArray(
    crypto.keccak256(transactionHash)
  );
  let transferBuy = TransferBuy.load(id);
  if (!transferBuy) {
    transferBuy = new TransferBuy(id);
    transferBuy.from = from
    transferBuy.to = to
    transferBuy.tokenId = tokenId

    transferBuy.blockNumber = blockNumber
    transferBuy.blockTimestamp = blockTimestamp
    transferBuy.transactionHash = transactionHash
    transferBuy.save();
  }
  return transferBuy;
}
