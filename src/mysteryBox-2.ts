import { Transfer as TransferEvent } from "../generated/lynks/lynks";
import {
  Transfer,
  MysteryBox2Balance,
  TransferMint,
  TransferBuy,
  MysteryBox2Amount,
} from "../generated/schema";
import { Bytes, crypto, BigInt, Address } from "@graphprotocol/graph-ts";

import {
  ADDRESS_ZERO,
  ADDRESS_ALIEN_SWAP,
  ADDRESS_ALIEN_SWAP2,
} from "./constant";

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.contract = event.address;

  let fromBalance = loadMysteryBox2Balance(event.params.from);
  fromBalance.balance = fromBalance.balance.minus(BigInt.fromI32(1));
  fromBalance.save();

  let toBalance = loadMysteryBox2Balance(event.params.to);
  toBalance.balance = toBalance.balance.plus(BigInt.fromI32(1));
  toBalance.save();
  entity.save();

  let lynksAmount2 = loadMysteryBox1Amount(event.params.from);
  lynksAmount2.transferAmountOut = lynksAmount2.transferAmountOut.plus(
    BigInt.fromI32(1)
  );
  lynksAmount2.save();

  let txTo: Address | null = event.transaction.to;

  //0x128adCD896f1982862dA3cE5977BD5152447cb02
  if (entity.from == ADDRESS_ZERO) {
    let transferMint = loadTransferMint(
      event.transaction.hash,
      event.params.from,
      event.params.to,
      event.params.tokenId,
      event.block.number,
      event.block.timestamp,
      event.address
    );
    transferMint.from = event.params.from;
    transferMint.to = event.params.to;
    transferMint.tokenId = event.params.tokenId;

    transferMint.blockNumber = event.block.number;
    transferMint.blockTimestamp = event.block.timestamp;
    transferMint.transactionHash = event.transaction.hash;
    transferMint.save();

    let lynksAmount = loadMysteryBox1Amount(event.params.to);
    lynksAmount.mintAmount = lynksAmount.mintAmount.plus(BigInt.fromI32(1));
    lynksAmount.save();
  } else if (entity.from == ADDRESS_ALIEN_SWAP) {
    let transferBuy = loadTransferBuy(
      event.transaction.hash,
      event.params.from,
      event.params.to,
      event.params.tokenId,
      event.block.number,
      event.block.timestamp,
      event.address
    );
    transferBuy.from = event.params.from;
    transferBuy.to = event.params.to;
    transferBuy.tokenId = event.params.tokenId;

    transferBuy.blockNumber = event.block.number;
    transferBuy.blockTimestamp = event.block.timestamp;
    transferBuy.transactionHash = event.transaction.hash;
    transferBuy.save();

    let lynksAmount = loadMysteryBox1Amount(event.params.to);
    lynksAmount.buyAmount = lynksAmount.buyAmount.plus(BigInt.fromI32(1));
    lynksAmount.save();
  } else if (txTo && txTo == ADDRESS_ALIEN_SWAP2) {
    let transferBuy = loadTransferBuy(
      event.transaction.hash,
      event.params.from,
      event.params.to,
      event.params.tokenId,
      event.block.number,
      event.block.timestamp,
      event.address
    );
    transferBuy.from = event.params.from;
    transferBuy.to = event.params.to;
    transferBuy.tokenId = event.params.tokenId;

    transferBuy.blockNumber = event.block.number;
    transferBuy.blockTimestamp = event.block.timestamp;
    transferBuy.transactionHash = event.transaction.hash;
    transferBuy.save();

    let lynksAmount = loadMysteryBox1Amount(event.params.to);
    lynksAmount.buyAmount = lynksAmount.buyAmount.plus(BigInt.fromI32(1));
    lynksAmount.save();
  } else {
    let lynksAmount1 = loadMysteryBox1Amount(event.params.to);
    lynksAmount1.transferAmountIn = lynksAmount1.transferAmountIn.plus(
      BigInt.fromI32(1)
    );
    lynksAmount1.save();
  }
}

export function loadMysteryBox2Balance(address: Bytes): MysteryBox2Balance {
  const id = Bytes.fromByteArray(crypto.keccak256(address));
  let balance = MysteryBox2Balance.load(id);
  if (!balance) {
    balance = new MysteryBox2Balance(id);
    balance.address = address;
    balance.balance = BigInt.fromI32(0);
    balance.save();
  }
  return balance;
}

export function loadMysteryBox1Amount(address: Bytes): MysteryBox2Amount {
  const id = Bytes.fromByteArray(crypto.keccak256(address));
  let amount = MysteryBox2Amount.load(id);
  if (!amount) {
    amount = new MysteryBox2Amount(id);
    amount.address = address;
    amount.transferAmountIn = BigInt.fromI32(0);
    amount.transferAmountOut = BigInt.fromI32(0);
    amount.mintAmount = BigInt.fromI32(0);
    amount.buyAmount = BigInt.fromI32(0);
    amount.save();
  }
  return amount;
}

export function loadTransferMint(
  transactionHash: Bytes,
  from: Bytes,
  to: Bytes,
  tokenId: BigInt,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  contract: Bytes
): TransferMint {
  const id = Bytes.fromByteArray(crypto.keccak256(transactionHash));
  let transferMint = TransferMint.load(id);
  if (!transferMint) {
    transferMint = new TransferMint(id);
    transferMint.from = from;
    transferMint.to = to;
    transferMint.tokenId = tokenId;

    transferMint.blockNumber = blockNumber;
    transferMint.blockTimestamp = blockTimestamp;
    transferMint.transactionHash = transactionHash;
    transferMint.contract = contract;
    transferMint.save();
  }
  return transferMint;
}

export function loadTransferBuy(
  transactionHash: Bytes,
  from: Bytes,
  to: Bytes,
  tokenId: BigInt,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  contract: Bytes,
): TransferBuy {
  const id = Bytes.fromByteArray(crypto.keccak256(transactionHash));
  let transferBuy = TransferBuy.load(id);
  if (!transferBuy) {
    transferBuy = new TransferBuy(id);
    transferBuy.from = from;
    transferBuy.to = to;
    transferBuy.tokenId = tokenId;

    transferBuy.blockNumber = blockNumber;
    transferBuy.blockTimestamp = blockTimestamp;
    transferBuy.transactionHash = transactionHash;
    transferBuy.contract = contract;
    transferBuy.save();
  }
  return transferBuy;
}
