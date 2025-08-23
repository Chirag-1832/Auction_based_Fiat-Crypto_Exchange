import { use, useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import EscrowABI from "../../../hardhat/artifacts/contracts/escrow.sol/EscrowP2P.json"; 
const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const EscrowCard = ({ escrow, setDataChanged }) => {

  const releaseEscrow = async (escrowId, sellerAddress, buyerAddress) => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not detected!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        EscrowABI.abi,
        signer
      );

      const tx = await contract.release(sellerAddress, buyerAddress);
      await tx.wait();
      console.log("Blockchain release successful:", tx.hash);

      const response = await axios.post(
        `http://localhost:3000/releaseEscrow/${escrowId}`
      );
      console.log("Escrow released in backend:", response.data);

      setDataChanged((prev) => !prev);
      alert("Escrow released successfully ✅");

    } catch (error) {
      console.error("Error releasing escrow:", error);
      alert("Failed to release escrow ");
    }
  };

  return (
    <div className="border border-gray-200 m-1 p-3 rounded-2xl">
      <div className="">
        <h3>Escrow Details:</h3>
        <p>Seller: {escrow.sellerAddress}</p>
        <p>Buyer: {escrow.buyerAddress}</p>
        <p>Amount (INR): {escrow.amountINR}</p>
        <p>Amount (ETH): {escrow.amountETH}</p>
      </div>
      <div>
        <button
          className="w-full p-2 mt-1 bg-blue-300 rounded-2xl text-gray-800 cursor-pointer hover:bg-blue-400"
          onClick={() => releaseEscrow(escrow.escrowId, escrow.sellerAddress, escrow.buyerAddress)}
        >
          Release Escrow
        </button>
      </div>
    </div>
  );
};

const EscrowPage = () => {
  const [escrowDetails, setEscrowDetails] = useState([]);
  const [dataChanged, setDataChanged] = useState(false);

  useEffect(() => {
    // Fetch escrow details from the server
    const fetchEscrowDetails = async () => {
      try {
        const response = await axios.get("http://localhost:3000/escrow");
        console.log("Escrow details:", response.data);
        setEscrowDetails(response.data);
      } catch (error) {
        console.error("Error fetching escrow details:", error);
      }
    };

    fetchEscrowDetails();
  }, [dataChanged]);

  return (
    <div>
      <h2>Escrow Details</h2>
      {escrowDetails.map(
        (escrow) =>
          escrow.open && (
            <EscrowCard
              key={escrow.escrowId}
              escrow={escrow}
              setDataChanged={setDataChanged}
            />
          )
      )}
    </div>
  );
};

export default EscrowPage;
