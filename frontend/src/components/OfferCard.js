import axios from "axios";
import { ethers } from "ethers";
import EscrowABI from "../../../hardhat/artifacts/contracts/escrow.sol/EscrowP2P.json"; 
const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const OfferCard = ({ offer,vendorID }) => {
    const handleAcceptOffer = async (buyerAddress) => {
        try {
        if (!window.ethereum) {
            alert("MetaMask not detected!");
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, EscrowABI.abi, signer);

        console.log("Sending acceptBid tx...");
        const tx = await contract.acceptBid(
            buyerAddress,
            ethers.parseEther(String(offer.bid_want)) 
        );
        await tx.wait(); 
        console.log("Tx confirmed:", tx.hash);

        const res = await axios.post(
            `http://localhost:3000/acceptBid/${vendorID}`,
            { buyerAddress, bid_want: offer.bid_want }
        );
        console.log("Backend updated:", res.data);

        alert("Offer accepted successfully ✅");
        } catch (err) {
        console.error("Error accepting offer:", err);
        alert("Error accepting offer ❌");
        }
    };
    return (
        <div className="border border-gray-200 m-1 p-3 rounded-2xl">
            <h3>Offer Details:</h3>
            <p>Buyer: {offer.buyer_address}</p>
            <p>Eth Want: {offer.bid_want} ETH</p>
            <p>Amount: {offer.buyer_bid_amount} INR</p>
            <button className="w-full p-2 mt-1 bg-blue-300 rounded-2xl text-gray-800 cursor-pointer hover:bg-blue-400" onClick={() => handleAcceptOffer(offer.buyer_address)}>Accept Offer</button>
        </div>
    );
};

export default OfferCard;
