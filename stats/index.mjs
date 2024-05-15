import {JsonRpcProvider, AbiCoder, ethers} from 'ethers'
import BigNumber from "bignumber.js";
import XLSX from 'xlsx'
// const { ethers } = require("ethers");
const ETH_ADDRESS = '0x000000000000000000000000000000000000800A'
const WETH_ADDRESS = '0x8280a4e7D5B3B658ec4580d3Bc30f5e50454F169'
const GAS_ADDRESS = '0x0000000000000000000000000000000000000000000000000000000000008001'
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
const provider = new JsonRpcProvider("https://rpc.zklink.io");
const LynksBalanceGte3 =
'{"query":"query lynks_transfers {\\n  lynksBalances(\\n    where: {balance_gt: \\"0\\"}\\n    orderBy: balance\\n    orderDirection: desc\\n    first: 1000\\n    skip: 2000\\n  ) {\\n    address\\n    balance\\n    id\\n  }\\n}","operationName":"lynks_transfers","extensions":{}}'
const getLynksBalanceQuery = (balance, skip) => {
  return `{"query":"query lynks_transfers {\\n  lynksBalances(\\n    where: {balance_gt: \\"${balance}\\"}\\n    orderBy: balance\\n    orderDirection: desc\\n    first: 1000\\n    skip: ${skip}\\n  ) {\\n    address\\n    balance\\n    id\\n  }\\n}","operationName":"lynks_transfers","extensions":{}}`
}
const getTradermarkBuyQuery = (address, tokenId) => {
  return `{"query":"query lynks_transfers {\\n  transferSingleBuys(\\n    where: {to: \\"${address}\\", trademark_id: \\"${tokenId}\\"}\\n    first: 1000\\n  ) {\\n    operator\\n    to\\n    trademark_id\\n    transactionHash\\n    value\\n  }\\n}","operationName":"lynks_transfers","extensions":{}}`
}
const getLynksBuyQuery = (address) => {
  return `{"query":"query lynks_transfers {\\n  transferBuys(\\n    where: {to: \\"${address}\\", contract: \\"0xd6d05CBdb8A70d3839166926f1b14d74d9953A08\\"}\\n  ) {\\n    tokenId\\n    transactionHash\\n    to\\n    from\\n  }\\n}","operationName":"lynks_transfers","extensions":{}}`;
};

const getMysteryBox1BuyQuery = (address) => {
  return `{"query":"query lynks_transfers {\\n  transferBuys(\\n    where: {to: \\"${address}\\", contract: \\"0x7fE8510dD408327806baCACaAFE2A445D9f3E9ee\\"}\\n  ) {\\n    tokenId\\n    transactionHash\\n    to\\n    from\\n  }\\n}","operationName":"lynks_transfers","extensions":{}}`
}

const getMysteryBox2BuyQuery = (address) => {
  return `{"query":"query lynks_transfers {\\n  transferBuys(\\n    where: {to: \\"${address}\\", contract: \\"0x831EeF41bf63c9cEF1ed53c226356eBF2D349cD6\\"}\\n  ) {\\n    tokenId\\n    transactionHash\\n    to\\n    from\\n  }\\n}","operationName":"lynks_transfers","extensions":{}}`
  
}

const getLynksAmountQuery = (addressList) => {
  const address_in = addressList.map(address => `\\"${address}\\"`).join(', ')
  return `{"query":"query lynks_transfers {\\n  lynksAmounts(\\n    where: {address_in: [${address_in}]}\\n  ) {\\n    address\\n    buyAmount\\n    mintAmount\\n    transferAmountIn\\n    transferAmountOut\\n  }\\n}","operationName":"lynks_transfers","extensions":{}}`
}

const getMysteryBox1AmountQuery = (addressList) => {
  const address_in = addressList.map(address => `\\"${address}\\"`).join(', ')
  return `{"query":"query lynks_transfers {\\n  mysteryBox1Amounts(\\n    where: {address_in: [${address_in}]}\\n  ) {\\n    address\\n    buyAmount\\n    mintAmount\\n    transferAmountIn\\n    transferAmountOut\\n  }\\n}","operationName":"lynks_transfers","extensions":{}}`
}

const getMysteryBox2AmountQuery = (addressList) => {
  const address_in = addressList.map(address => `\\"${address}\\"`).join(', ')
  return `{"query":"query lynks_transfers {\\n  mysteryBox2Amounts(\\n    where: {address_in: [${address_in}]}\\n  ) {\\n    address\\n    buyAmount\\n    mintAmount\\n    transferAmountIn\\n    transferAmountOut\\n  }\\n}","operationName":"lynks_transfers","extensions":{}}`
}


const getTrademarkAmountQuery = (addressList, tokenId) => {
  const address_in = addressList.map(address => `\\"${address}\\"`).join(', ')
  return `{"query":"query lynks_transfers {\\n  trademarkAmounts(\\n    where: {trademark_id: \\"${tokenId}\\", address_in: [${address_in}]}\\n  ) {\\n    address\\n    buyAmount\\n    mintAmount\\n    trademark_id\\n    transferAmountIn\\n    transferAmountOut\\n  }\\n}","operationName":"lynks_transfers","extensions":{}}`
}

async function fetchData(query, key, ) {
  return fetch("http://3.114.68.110:8000/subgraphs/name/lynks3", {
    headers: {
      "content-type": "application/json",
    },
    body: query,
    method: "POST",
    mode: "cors",
    credentials: "omit",
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        console.error("Error:", res.error);
        return [];
      } else {
        const data = res.data[key];
        // console.table(data);
        return data;
      }
    })
    .catch(console.error);
}

const formatCost = (value) => {
  return new BigNumber(value).dividedBy(10**18).toFixed(2)
}

async function main() {
  // const va = new BigNumber(1416407050000000000000n + 368800000000000000n).dividedBy(10**18).toFixed(2)
  // console.log('val: ', va)
  // return
  console.log('************** start calc lynks buy cost **************')
  const lynksBuyCost = []

  // *** all data
  // const res = []
  // let skip = 0;
  // while (true) {
  //   const query = getLynksBalanceQuery(0, skip);
  //   const data = await fetchData(query, "lynksBalances");
  //   if (data.length === 0) {
  //     break;
  //   }
  //   res.push(...data);
  //   skip += 1000;
  // }

  // ** part data
  let skip = 0;
  const query = getLynksBalanceQuery(2, skip);
  const res = await fetchData(query, 'lynksBalances')

  console.log('res length: ', res.length)

  for (const item of res) {
    const { address, balance } = item;
    const query = getLynksBuyQuery(address);
    const transfers = await fetchData(query, "transferBuys");
    let cost = 0n;
    for (const transfer of transfers) {
      const { transactionHash } = transfer;
      const val = await getCostByHash(transactionHash, address)
      cost += val;
    }
    lynksBuyCost.push({ address, cost: formatCost(cost) });
  }
  // console.table(lynksBuyCost);
  console.log('************** end calc lynks buy cost **************')


  const mysteryBox1BuyCost = []
  for (const item of res) {
    const { address, balance } = item;
    const query = getMysteryBox1BuyQuery(address);
    const transfers = await fetchData(query, "transferBuys");
    let cost = 0n;
    for (const transfer of transfers) {
      const { transactionHash } = transfer;
      const val = await getCostByHash(transactionHash, address)
      cost += val;
    }
    mysteryBox1BuyCost.push({ address, cost: formatCost(cost) });
  }


  const mysteryBox2BuyCost = []
  for (const item of res) {
    const { address, balance } = item;
    const query = getMysteryBox2BuyQuery(address);
    const transfers = await fetchData(query, "transferBuys");
    let cost = 0n;
    for (const transfer of transfers) {
      const { transactionHash } = transfer;
      const val = await getCostByHash(transactionHash, address)
      cost += val;
    }
    mysteryBox2BuyCost.push({ address, cost: formatCost(cost) });
  }


  const trademarkBuyCosts_1 = []
  console.log('************** start calc trademark buy cost **************')

  for(const item of res) {
    const { address, balance } = item;
    const query = getTradermarkBuyQuery(address, 1);
    const transfers = await fetchData(query, "transferSingleBuys");
    let cost = 0n;
    const map = {}
    for (const transfer of transfers) {
      const { transactionHash, value } = transfer;
      if(map[transactionHash]) {
        continue;
      } else {
        map[transactionHash] = true;
      }
      const val = await getCostByHash(transactionHash, address)
      cost += val;
    }
    trademarkBuyCosts_1.push({ address, cost: formatCost(cost) });
  }
  const trademarkBuyCosts_2 = []
  for(const item of res) {
    const { address, balance } = item;
    const query = getTradermarkBuyQuery(address, 2);
    const transfers = await fetchData(query, "transferSingleBuys");
    let cost = 0n;
    const map = {}

    for (const transfer of transfers) {
      const { transactionHash, value } = transfer;
      if(map[transactionHash]) {
        continue;
      } else {
        map[transactionHash] = true;
      }
      const val = await getCostByHash(transactionHash, address)
      cost += val;
    }
    trademarkBuyCosts_2.push({ address, cost: formatCost(cost) });
  }
  const trademarkBuyCosts_3 = []
  for(const item of res) {
    const { address, balance } = item;
    const query = getTradermarkBuyQuery(address, 3);
    const transfers = await fetchData(query, "transferSingleBuys");
    let cost = 0n;
    const map ={}
    for (const transfer of transfers) {
      const { transactionHash, value } = transfer;
      if(map[transactionHash]) {
        continue;
      } else {
        map[transactionHash] = true;
      }
      const val = await getCostByHash(transactionHash, address)
      cost += val;
    }
    trademarkBuyCosts_3.push({ address, cost: formatCost(cost) });
  }
  const trademarkBuyCosts_4 = []
  for(const item of res) {
    const { address, balance } = item;
    const query = getTradermarkBuyQuery(address, 4);
    const transfers = await fetchData(query, "transferSingleBuys");
    let cost = 0n;
    const map = {}
    for (const transfer of transfers) {
      const { transactionHash, value } = transfer;
      if(map[transactionHash]) {
        continue;
      } else {
        map[transactionHash] = true;
      }
      const val = await getCostByHash(transactionHash, address)
      cost += val;
    }
    trademarkBuyCosts_4.push({ address, cost: formatCost(cost) });
  }
  // console.table(trademarkBuyCost);
  console.log('************** end calc trademark buy cost **************')


  const lynksAmounts = []
  let start = 0;
  while(true) {
    let end = start + 100;
    const addressList = res.slice(start, end).map(item => item.address);
    if(addressList.length > 0) {
      const lynksAmountQuery = getLynksAmountQuery(addressList)
      lynksAmounts.push(...(await fetchData(lynksAmountQuery, 'lynksAmounts')))
      start = end;
    } else {
      break;
    }
  }

  const mysteryBox1Amounts = []
  start =0;
  while(true) {
    let end = start + 100;
    const addressList = res.slice(start, end).map(item => item.address);
    if(addressList.length > 0) {
      const amountQuery = getMysteryBox1AmountQuery(addressList)
      mysteryBox1Amounts.push(...(await fetchData(amountQuery, 'mysteryBox1Amounts')))
      start = end;
    } else {
      break;
    }
  }

  const mysteryBox2Amounts = []
  start = 0;
  while(true) {
    let end = start + 100;
    const addressList = res.slice(start, end).map(item => item.address);
    if(addressList.length > 0) {
      const amountQuery = getMysteryBox2AmountQuery(addressList)
      mysteryBox2Amounts.push(...(await fetchData(amountQuery, 'mysteryBox2Amounts')))
      start = end;
    } else {
      break;
    }
  }

  

  const trademarkAmounts_1 = []
  start = 0;
  while(true) {
    let end = start + 100;
    const addressList = res.slice(start, end).map(item => item.address);
    if(addressList.length > 0) {
      const trademarkAmountQuery_1 = getTrademarkAmountQuery(addressList, 1)
      trademarkAmounts_1.push(...(await fetchData(trademarkAmountQuery_1, 'trademarkAmounts')))
      start = end;
    } else {
      break;
    }
  }

  const trademarkAmounts_2 = []
  start = 0;
  while(true) {
    let end = start + 100;
    const addressList = res.slice(start, end).map(item => item.address);
    if(addressList.length > 0) {
      const trademarkAmountQuery_2 = getTrademarkAmountQuery(addressList, 2)
      trademarkAmounts_2.push(...(await fetchData(trademarkAmountQuery_2, 'trademarkAmounts')))
      start = end;
    } else {
      break;
    }
  }

  const trademarkAmounts_3 = []
  start = 0;
  while(true) {
    let end = start + 100;
    const addressList = res.slice(start, end).map(item => item.address);
    if(addressList.length > 0) {
      const trademarkAmountQuery_3 = getTrademarkAmountQuery(addressList, 3)
      trademarkAmounts_3.push(...(await fetchData(trademarkAmountQuery_3, 'trademarkAmounts')))
      start = end;
    } else {
      break;
    }
  }

  const trademarkAmounts_4 = []
  start = 0;
  while(true) {
    let end = start + 100;
    const addressList = res.slice(start, end).map(item => item.address);
    if(addressList.length > 0) {
      const trademarkAmountQuery_4 = getTrademarkAmountQuery(addressList, 4)
      trademarkAmounts_4.push(...(await fetchData(trademarkAmountQuery_4, 'trademarkAmounts')))
      start = end;
    } else {
      break;
    }
  }


  const result = []
  for(let i = 0; i < res.length; i++) {
    const item = res[i]
    const { address, balance } = item;
    const lynksAmount = lynksAmounts.find(item => item.address === address)
    const lynksBuyCostItem = lynksBuyCost.find(item => item.address === address)
    const mysteryBox1Amount = mysteryBox1Amounts.find(item => item.address === address)
    const mysteryBox2Amount = mysteryBox2Amounts.find(item => item.address === address)
    const mysteryBox1BuyCostItem = mysteryBox1BuyCost.find(item => item.address === address)
    const mystereyBox2BuyCostItem = mysteryBox2BuyCost.find(item => item.address === address)
    const trademarkAmount_1 = trademarkAmounts_1.find(item => item.address === address)
    const trademarkAmount_2 = trademarkAmounts_2.find(item => item.address === address)
    const trademarkAmount_3 = trademarkAmounts_3.find(item => item.address === address)
    const trademarkAmount_4 = trademarkAmounts_4.find(item => item.address === address)
    const trademarkBuyCost_1 = trademarkBuyCosts_1.find(item => item.address === address)
    const trademarkBuyCost_2 = trademarkBuyCosts_2.find(item => item.address === address)
    const trademarkBuyCost_3 = trademarkBuyCosts_3.find(item => item.address === address)
    const trademarkBuyCost_4 = trademarkBuyCosts_4.find(item => item.address === address)
    result.push({
      address,
      balance,
      buyAmount: lynksAmount?.buyAmount,
      mintAmount: lynksAmount?.mintAmount,
      transferIn: lynksAmount?.transferAmountIn,
      transferOut: lynksAmount?.transferAmountOut,
      lynks_cost: lynksBuyCostItem?.cost,
      box_1_buy_amount: mysteryBox1Amount?.buyAmount,
      box_1_mint_amount: mysteryBox1Amount?.mintAmount,
      box_1_transfer_in: mysteryBox1Amount?.transferAmountIn,
      box_1_transfer_out: mysteryBox1Amount?.transferAmountOut,
      box_1_cost: mysteryBox1BuyCostItem?.cost,
      box_2_buy_amount: mysteryBox2Amount?.buyAmount,
      box_2_mint_amount: mysteryBox2Amount?.mintAmount,
      box_2_transfer_in: mysteryBox2Amount?.transferAmountIn,
      box_2_transfer_out: mysteryBox2Amount?.transferAmountOut,
      box_2_cost: mystereyBox2BuyCostItem?.cost,
      ['1_buy']: trademarkAmount_1?.buyAmount,
      ['1_mint']: trademarkAmount_1?.mintAmount,
      ['1_transferIn']: trademarkAmount_1?.transferAmountIn,
      ['1_transferOut']: trademarkAmount_1?.transferAmountOut,
      ['1_trademark_cost']: trademarkBuyCost_1?.cost,
      ['2_buy']: trademarkAmount_2?.buyAmount,
      ['2_mint']: trademarkAmount_2?.mintAmount,
      ['2_transferIn']: trademarkAmount_2?.transferAmountIn,
      ['2_transferOut']: trademarkAmount_2?.transferAmountOut,
      ['2_tradermark_cost']: trademarkBuyCost_2?.cost,
      ['3_buy']: trademarkAmount_3?.buyAmount,
      ['3_mint']: trademarkAmount_3?.mintAmount,
      ['3_transferIn']: trademarkAmount_3?.transferAmountIn,
      ['3_transferOut']: trademarkAmount_3?.transferAmountOut,
      ['3_trademark_cost']: trademarkBuyCost_3?.cost,
      ['4_buy']: trademarkAmount_4?.buyAmount,
      ['4_mint']: trademarkAmount_4?.mintAmount,
      ['4_transferIn']: trademarkAmount_4?.transferAmountIn,
      ['4_transferOut']: trademarkAmount_4?.transferAmountOut,
      ['4_trademark_cost']: trademarkBuyCost_4?.cost,
    })
  }

  writeXlsx(result);
  console.log('write xlsx done.')
  // const totalCost = []
  // for(let i = 0; i < res.length; i++) {
  //   totalCost.push({
  //     address: res[i].address,
  //     cost:  new BigNumber(Number(lynksBuyCost[i].cost) + Number(trademarkBuyCost[i].cost)).dividedBy(10**18).toFixed(2)
  //   })
  // }
  // console.table(totalCost);

}
async function writeXlsx(result) {
  const headers = Object.keys(result[0])
  const worksheet = XLSX.utils.json_to_sheet(result, {header:[...headers], skipHeader:false});
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, 'nft_stats.xlsx');
}

// main();

function isSameAddress(a,b) {
  return a.toLowerCase() === b.toLowerCase();
}

async function getCostByHash(hash, address) {
  const receipt = await provider.getTransactionReceipt(hash);
  // console.log("receipt: ", receipt.logs);
  // console.log("log: ", receipt.logs[2]);
  const abiCoder = new AbiCoder()
  // console.log('address: ',receipt.logs[2].topics[1], abiCoder.decode(['address'], receipt.logs[2].topics[1]))
  const transferLog = receipt.logs.find(
    (log) => log.address === ETH_ADDRESS && 
    isSameAddress(abiCoder.decode(['address'], log.topics[1])[0],  address) && 
    log.topics[2] !== GAS_ADDRESS
  );
  const wethTransferLog = receipt.logs.find(
    (log) => log.address === WETH_ADDRESS && 
    log.topics[0] === TRANSFER_TOPIC &&
    isSameAddress(abiCoder.decode(['address'], log.topics[1])[0],  address) && 
    log.topics[2] !== GAS_ADDRESS
  )
  // console.log('wethTransfer: ', wethTransferLog)
  if(transferLog) {
    const value = abiCoder.decode(['uint256'], transferLog.data)[0];
    // console.log("value: ", value, transferLog.data);
    return value;
  } else if(wethTransferLog) {
    const value = abiCoder.decode(['uint256'], wethTransferLog.data)[0];
    // console.log("value: ", value, wethTransferLog.data);
    return value
  } else {
    console.log('no data: ', hash, address)
    return 0n;
  }
}

// getCostByHash(
//   "0x99ff0b29c3a4b42b837c88c2544a28c0446b3cd521edc6bb209551dca58f5b93",
//   '0x462c7EdA2B63FFebeA38256a8b1160dE43C91D43'
// );

async function test() {
  const res = await fetchData(LynksBalanceGte3, "lynksBalances");

  const trademarkAmountQuery_1 = getTrademarkAmountQuery(res.map(item => item.address), 1)
  const trademarkAmount_1 = await fetchData(trademarkAmountQuery_1, 'trademarkAmounts')
  console.log(trademarkAmount_1)

  // const trademarkAmountQuery_2 = getTrademarkAmountQuery(res.map(item => item.address), 2)
  // const trademarkAmount_2 = await fetchData(trademarkAmountQuery_2, 'trademarkAmounts')

  // const trademarkAmountQuery_3 = getTrademarkAmountQuery(res.map(item => item.address), 3)
  // const trademarkAmount_3 = await fetchData(trademarkAmountQuery_3, 'trademarkAmounts')

  // const trademarkAmountQuery_4 = getTrademarkAmountQuery(res.map(item => item.address), 4)
  // const trademarkAmount_4 = await fetchData(trademarkAmountQuery_4, 'trademarkAmounts')

}
main()
// test()