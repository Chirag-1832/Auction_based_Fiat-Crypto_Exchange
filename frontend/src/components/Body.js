import { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import EscrowABI from "../../../hardhat/artifacts/contracts/escrow.sol/EscrowP2P.json"; 
const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";


const Body = () => {
  const [bidAsk, setBidAsk] = useState("");
  const [ethAmount, setEthAmount] = useState("");

const HandleClick = async (bidAsk, ethAmount) => {
  try {
    if (!window.ethereum) throw new Error("MetaMask not installed");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(CONTRACT_ADDRESS, EscrowABI.abi, signer);


    const tx = await contract.addLiquidity({
      value: ethers.parseEther(ethAmount.toString()) 
    });
    await tx.wait(); 

    console.log("Liquidity locked on-chain ✅:", tx.hash);

    const payload = {
      sellerAddress: await signer.getAddress(),
      amount: Number(ethAmount),
      bidAsk: Number(bidAsk)
    };
    const res = await axios.post("http://localhost:3000/createBidItem", payload);

    console.log("Created Bid Item (DB):", res.data);
    alert("Bid created successfully ✅");

    setBidAsk("");
    setEthAmount("");
  
  } catch (error) {
    console.error("Error creating bid item:", error);
    alert("Failed ❌");
  }
};
  return (
    <div>
      <div className="flex flex-col items-center my-30 p-2">
        <div className="flex flex-col  gap-1 border w-[500px]  mb-1 mt-3 p-3 rounded-2xl">
          <label className="text-center" htmlFor="bid-amount-eth">Bid Amount (ETH)</label>
          <input
            className=" text-center appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-number-spin-button]:appearance-none *:rounded-full p-2 m-2 "
            type="number"
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
            placeholder="0 ETH"
          />
          <label className="text-center" htmlFor="bid-ask-inr">Bid Ask (INR)</label>
          <input
            className=" text-center appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-number-spin-button]:appearance-none *:rounded-full p-2 mt-4"
            type="number"
            value={bidAsk}
            onChange={(e) => setBidAsk(e.target.value)}
            placeholder="0 INR"
          />
        </div>
        <button
          onClick={() => HandleClick(bidAsk, ethAmount)}
          className="m-1 w-[500px] h-[75px] bg-blue-300 rounded-2xl text-gray-800 cursor-pointer"
        >
          ADD YOUR ITEM
        </button>
        <button className="w-[500px] h-[75px] bg-blue-300 rounded-2xl text-gray-800 cursor-pointer">
          CONNECT YOUR WALLET
        </button>
      </div>
    </div>
  );
};

export default Body;
