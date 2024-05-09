// const XLSX = require('xlsx');
import {JsonRpcProvider, AbiCoder, ethers} from 'ethers'
import BigNumber from "bignumber.js";

// const { ethers } = require("ethers");
const ETH_ADDRESS = '0x000000000000000000000000000000000000800A'
const WETH_ADDRESS = '0x8280a4e7D5B3B658ec4580d3Bc30f5e50454F169'
const GAS_ADDRESS = '0x0000000000000000000000000000000000000000000000000000000000008001'
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
const provider = new JsonRpcProvider("https://rpc.zklink.io");
const LynksBalanceGte3 =
  '{"query":"query lynks_transfers {\\n  lynksBalances(where: {balance_gte: \\"3\\"}, orderBy: balance, orderDirection: desc) {\\n    address\\n    balance\\n  }\\n}","operationName":"lynks_transfers","extensions":{}}';
const getTradermarkBuyQuery = (address) => {
  return `{"query":"query lynks_transfers {\\n  transferSingleBuys(\\n    where: {to: \\"${address}\\"}\\n    first: 1000\\n  ) {\\n    operator\\n    to\\n    trademark_id\\n    transactionHash\\n    value\\n  }\\n}","operationName":"lynks_transfers","extensions":{}}`
}
const getLynksBuyQuery = (address) => {
  return `{"query":"query lynks_transfers {\\n  transferBuys(where: {to: \\"${address}\\"}) {\\n    transactionHash\\n    tokenId\\n    to\\n    from\\n  }\\n}","operationName":"lynks_transfers","extensions":{}}`;
};

async function fetchData(query, key) {
  return fetch("http://3.114.68.110:8000/subgraphs/name/lynks4", {
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

async function main() {
  // const va = new BigNumber(1416407050000000000000n + 368800000000000000n).dividedBy(10**18).toFixed(2)
  // console.log('val: ', va)
  // return

  const lynksBuyCost = []
  const res = await fetchData(LynksBalanceGte3, "lynksBalances");
  console.log('************** start calc lynks buy cost **************')
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
    lynksBuyCost.push({ address, cost });
  }
  console.table(lynksBuyCost);
  console.log('************** end calc lynks buy cost **************')

  const trademarkBuyCost = []
  console.log('************** start calc trademark buy cost **************')

  for(const item of res) {
    const { address, balance } = item;
    const query = getTradermarkBuyQuery(address);
    const transfers = await fetchData(query, "transferSingleBuys");
    let cost = 0n;
    for (const transfer of transfers) {
      const { transactionHash, value } = transfer;
      const val = await getCostByHash(transactionHash, address)
      cost += val;
    }
    trademarkBuyCost.push({ address, cost });
  }
  console.table(trademarkBuyCost);
  console.log('************** end calc trademark buy cost **************')

  const totalCost = []
  for(let i = 0; i < res.length; i++) {
    totalCost.push({
      address: res[i].address,
      cost:  new BigNumber(lynksBuyCost[i].cost + trademarkBuyCost[i].cost).dividedBy(10**18).toFixed(2)
    })
  }
  console.table(totalCost);

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
main()