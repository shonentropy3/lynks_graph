import { Transfer as TransferEvent } from "../generated/lynks/lynks";
import {
    Transfer,
    TransferBuy,
    LynksAmount,
  } from "../generated/schema";
import { Bytes, crypto, BigInt, Address } from "@graphprotocol/graph-ts";
import {
    ADDRESS_ALIEN_SWAP3
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

    let lynksAddress: Address | null = event.address;
  
    if (!lynksAddress && lynksAddress == ADDRESS_ALIEN_SWAP3) {
      let transferBuy = loadTransferBuy(
        event.transaction.hash,
        event.params.from,
        event.params.to,
        event.params.tokenId,
        event.block.number,
        event.block.timestamp
      );
      transferBuy.from = event.params.from;
      transferBuy.to = event.params.to;
      transferBuy.tokenId = event.params.tokenId;
  
      transferBuy.blockNumber = event.block.number;
      transferBuy.blockTimestamp = event.block.timestamp;
      transferBuy.transactionHash = event.transaction.hash;
      transferBuy.save();
  
      let lynksAmount = loadLynksAmount(event.params.to);
      lynksAmount.buyAmount = lynksAmount.buyAmount.plus(BigInt.fromI32(1));
      lynksAmount.address = event.params.to;
      lynksAmount.save();
    } 
    entity.save();
  }
  
  export function loadLynksAmount(address: Bytes): LynksAmount {
    const id = Bytes.fromByteArray(crypto.keccak256(address));
    let lynksAmount = LynksAmount.load(id);
    if (!lynksAmount) {
      lynksAmount = new LynksAmount(id);
      lynksAmount.address = address;
      lynksAmount.transferAmountIn = BigInt.fromI32(0);
      lynksAmount.transferAmountOut = BigInt.fromI32(0);
      lynksAmount.mintAmount = BigInt.fromI32(0);
      lynksAmount.buyAmount = BigInt.fromI32(0);
      lynksAmount.save();
    }
    return lynksAmount;
  }
  
  export function loadTransferBuy(
    transactionHash: Bytes,
    from: Bytes,
    to: Bytes,
    tokenId: BigInt,
    blockNumber: BigInt,
    blockTimestamp: BigInt
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
      transferBuy.save();
    }
    return transferBuy;
  }
  