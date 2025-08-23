import { ethers } from "ethers";
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

async function getTxs() {
  const blockNumber = await provider.getBlockNumber();
  for (let i = 0; i <= blockNumber; i++) {
    const block = await provider.getBlock(i, true); 
    console.log(block.transactions);
  }
}

getTxs();
