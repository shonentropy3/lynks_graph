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
  TransferSingleBuy,
  TrademarkAmount
} from "../generated/schema"
import { Bytes, crypto, BigInt } from "@graphprotocol/graph-ts";

const ADDRESS1 = Bytes.fromHexString("0x0000000000000000000000000000000000000000");
const ADDRESS2 = Bytes.fromHexString("0x128adCD896f1982862dA3cE5977BD5152447cb02");

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

//0x128adCD896f1982862dA3cE5977BD5152447cb02
  if(entity.from == Bytes.fromHexString("0x0000000000000000000000000000000000000000")){
    let transferBatchMint = loadTransferBatchMint(event.params.operator,
      event.params.to,
      event.params.ids as BigInt[],
      event.params.values as BigInt[],
      event.block.number,
      event.block.timestamp,
      event.transaction.hash);
    transferBatchMint.operator = event.params.operator
    transferBatchMint.from = event.params.from
    transferBatchMint.to = event.params.to
    transferBatchMint.ids = event.params.ids
    transferBatchMint.values = event.params.values
  
    transferBatchMint.blockNumber = event.block.number
    transferBatchMint.blockTimestamp = event.block.timestamp
    transferBatchMint.transactionHash = event.transaction.hash
    transferBatchMint.save()

    for(let i = 0; i < event.params.ids.length; i++) {
      let id = event.params.ids[i]
      let value = event.params.values[i]
      let trademarkAmount = loadTrademarkAmount(event.params.to, id, BigInt.fromI32(0), value, BigInt.fromI32(0));
      trademarkAmount.mintAmount = trademarkAmount.mintAmount.plus(value)
      trademarkAmount.address = event.params.to
      trademarkAmount.trademark_id = id
      trademarkAmount.save()
    }
  }

  if(entity.from == Bytes.fromHexString("0x128adCD896f1982862dA3cE5977BD5152447cb02")){
    let transferBatchBuy = loadTransferBatchBuy(event.params.operator,
      event.params.to,
      event.params.ids as BigInt[],
      event.params.values as BigInt[],
      event.block.number,
      event.block.timestamp,
      event.transaction.hash);
      transferBatchBuy.operator = event.params.operator
      transferBatchBuy.from = event.params.from
      transferBatchBuy.to = event.params.to
      transferBatchBuy.ids = event.params.ids
      transferBatchBuy.values = event.params.values
  
      transferBatchBuy.blockNumber = event.block.number
      transferBatchBuy.blockTimestamp = event.block.timestamp
      transferBatchBuy.transactionHash = event.transaction.hash
      transferBatchBuy.save()

      for(let i = 0; i < event.params.ids.length; i++) {
        let id = event.params.ids[i]
        let value = event.params.values[i]
        let trademarkAmount = loadTrademarkAmount(event.params.to, id, BigInt.fromI32(0), BigInt.fromI32(0), value);
        trademarkAmount.buyAmount = trademarkAmount.buyAmount.plus(value)
        trademarkAmount.address = event.params.to
        trademarkAmount.trademark_id = id
        trademarkAmount.save()
      }
  }

  if(entity.from != ADDRESS1 && entity.from != ADDRESS2 ) {
    for(let i = 0; i < event.params.ids.length; i++) {
      let id = event.params.ids[i]
      let value = event.params.values[i]
      let trademarkAmount = loadTrademarkAmount(event.params.to, id, value, BigInt.fromI32(0), BigInt.fromI32(0));
      trademarkAmount.transferAmount = trademarkAmount.transferAmount.plus(value)
      trademarkAmount.address = event.params.to
      trademarkAmount.trademark_id = id
      trademarkAmount.save()
    }
  }

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
  
  if(entity.from == Bytes.fromHexString("0x0000000000000000000000000000000000000000")){
  let transferSingleMint = loadTransferSingleMint(event.params.operator,
    event.params.from,
    event.params.to,
    event.params.id,
    event.params.value,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash);
    transferSingleMint.operator = event.params.operator
    transferSingleMint.from = event.params.from
    transferSingleMint.to = event.params.to
    transferSingleMint.trademark_id = event.params.id
    transferSingleMint.value = event.params.value

    transferSingleMint.blockNumber = event.block.number
    transferSingleMint.blockTimestamp = event.block.timestamp
    transferSingleMint.transactionHash = event.transaction.hash
    transferSingleMint.save()

    let trademarkAmount = loadTrademarkAmount(event.params.to, event.params.id, BigInt.fromI32(0), event.params.value, BigInt.fromI32(0));
    trademarkAmount.address = event.params.to
    trademarkAmount.mintAmount = trademarkAmount.mintAmount.plus(event.params.value)
    trademarkAmount.trademark_id = event.params.id
    trademarkAmount.save()
  }
  if(entity.from == Bytes.fromHexString("0x128adCD896f1982862dA3cE5977BD5152447cb02")){
    let transferSingleBuy = loadTransferSingleBuy(event.params.operator,
      event.params.from,
      event.params.to,
      event.params.id,
      event.params.value,
      event.block.number,
      event.block.timestamp,
      event.transaction.hash);
      transferSingleBuy.operator = event.params.operator
      transferSingleBuy.from = event.params.from
      transferSingleBuy.to = event.params.to
      transferSingleBuy.trademark_id = event.params.id
      transferSingleBuy.value = event.params.value
  
      transferSingleBuy.blockNumber = event.block.number
      transferSingleBuy.blockTimestamp = event.block.timestamp
      transferSingleBuy.transactionHash = event.transaction.hash
      transferSingleBuy.save()

      let trademarkAmount = loadTrademarkAmount(event.params.to, event.params.id, BigInt.fromI32(0), BigInt.fromI32(0), event.params.value);
    trademarkAmount.address = event.params.to
    trademarkAmount.buyAmount = trademarkAmount.buyAmount.plus(event.params.value)
    trademarkAmount.trademark_id = event.params.id
    trademarkAmount.save()
    }

    if(entity.from != ADDRESS1 && entity.from != ADDRESS2 ) {
      let trademarkAmount = loadTrademarkAmount(event.params.to, event.params.id, event.params.value, BigInt.fromI32(0), BigInt.fromI32(0));
      trademarkAmount.transferAmount = trademarkAmount.transferAmount.plus(event.params.value)
      trademarkAmount.trademark_id = event.params.id
      trademarkAmount.save()
    }

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

export function loadTrademarkAmount(address: Bytes, trademark_id: BigInt, transferAmount: BigInt, mintAmount: BigInt, buyAmount: BigInt): TrademarkAmount{
  const id = Bytes.fromByteArray(
    crypto.keccak256(address).concatI32(trademark_id.toI32())
  );
  let trademarkAmount = TrademarkAmount.load(id);
  if (!trademarkAmount) {
    trademarkAmount = new TrademarkAmount(id);
    trademarkAmount.address = address;
    trademarkAmount.transferAmount = transferAmount;
    trademarkAmount.mintAmount = mintAmount;
    trademarkAmount.buyAmount = buyAmount;
    trademarkAmount.trademark_id = trademark_id;
    trademarkAmount.save();
  }
  return trademarkAmount;
}

export function loadTransferBatchMint(operator: Bytes,
  to: Bytes,
  ids: BigInt[],
  values: BigInt[],
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes): TransferBatchMint {
  const id = Bytes.fromByteArray(
    crypto.keccak256(transactionHash)
  );
  let transferBatchMint = TransferBatchMint.load(id);
  if (!transferBatchMint) {
    transferBatchMint = new TransferBatchMint(id);
    transferBatchMint.operator = operator
    transferBatchMint.to = to
    transferBatchMint.ids = ids
    transferBatchMint.values = values

    transferBatchMint.blockNumber = blockNumber
    transferBatchMint.blockTimestamp = blockTimestamp
    transferBatchMint.transactionHash = transactionHash
    transferBatchMint.save();
  }
  return transferBatchMint;
}

export function loadTransferBatchBuy(operator: Bytes,
  to: Bytes,
  ids: BigInt[],
  values: BigInt[],
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes): TransferBatchBuy {
  const id = Bytes.fromByteArray(
    crypto.keccak256(transactionHash)
  );
  let transferBatchBuy = TransferBatchBuy.load(id);
  if (!transferBatchBuy) {
    transferBatchBuy = new TransferBatchBuy(id);
    transferBatchBuy.operator = operator
    transferBatchBuy.to = to
    transferBatchBuy.ids = ids
    transferBatchBuy.values = values

    transferBatchBuy.blockNumber = blockNumber
    transferBatchBuy.blockTimestamp = blockTimestamp
    transferBatchBuy.transactionHash = transactionHash
    transferBatchBuy.save();
  }
  return transferBatchBuy;
}

export function loadTransferSingleMint(
  operator: Bytes,
  from: Bytes,
  to: Bytes,
  trademark_id: BigInt,
  value: BigInt,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes,
): TransferSingleMint {
  const id = Bytes.fromByteArray(
    crypto.keccak256(transactionHash)
  );
  let transferSingleMint = TransferSingleMint.load(id);
  if (!transferSingleMint) {
    transferSingleMint = new TransferSingleMint(id);
    transferSingleMint.operator = operator
    transferSingleMint.from = from
    transferSingleMint.to = to
    transferSingleMint.trademark_id = trademark_id
    transferSingleMint.value = value

    transferSingleMint.blockNumber = blockNumber
    transferSingleMint.blockTimestamp = blockTimestamp
    transferSingleMint.transactionHash = transactionHash
    transferSingleMint.save();
  }
  return transferSingleMint;
}

export function loadTransferSingleBuy(
  operator: Bytes,
  from: Bytes,
  to: Bytes,
  trademark_id: BigInt,
  value: BigInt,
  blockNumber: BigInt,
  blockTimestamp: BigInt,
  transactionHash: Bytes,
): TransferSingleBuy {
  const id = Bytes.fromByteArray(
    crypto.keccak256(transactionHash)
  );
  let transferSingleBuy = TransferSingleBuy.load(id);
  if (!transferSingleBuy) {
    transferSingleBuy = new TransferSingleBuy(id);
    transferSingleBuy.operator = operator
    transferSingleBuy.from = from
    transferSingleBuy.to = to
    transferSingleBuy.trademark_id = trademark_id
    transferSingleBuy.value = value

    transferSingleBuy.blockNumber = blockNumber
    transferSingleBuy.blockTimestamp = blockTimestamp
    transferSingleBuy.transactionHash = transactionHash
    transferSingleBuy.save();
  }
  return transferSingleBuy;
}

