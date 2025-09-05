import axios from "axios";
import { ethers } from "ethers";
import OfferCard from "./OfferCard";
import { useState } from "react";

const BidCard = ({ vendor }) => {

    const [bidEnabled, setBidEnabled] = useState(false);
    const [bid_want, setBid_want] = useState("");
    const [amount, setAmount] = useState("");

    const [offers, setOffers] = useState([]);

    const handleShowOffers = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/showOffers/${vendor.vendor_id}`);
            console.log("Offers:", res.data);
            setOffers(res.data);
        } catch (err) {
            console.error("Error fetching offers:", err);
            alert("Error fetching offers");
        }
    };

const handleBid = async (bid_want, amount) => {
  try {
    if (!window.ethereum) {
      alert("MetaMask not detected!");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const buyerAddress = await signer.getAddress();  

    const bidData = {
      bid_want: bid_want,
      buyerAddress: buyerAddress,
      amount: amount
    };

    const res = await axios.post(
      `http://localhost:3000/makeBid/${vendor.vendor_id}`,
      bidData
    );

    console.log("Bid placed:", res.data);
    alert("Bid placed successfully ");
  } catch (err) {
    console.error("Error placing bid:", err);
    alert("Error placing bid ");
  }
};

    return (
    <div className="flex flex-col w-[500px]">
        <div className="flex flex-col justify-between border border-gray-200 m-1 p-3 rounded-2xl ">
            <div className="flex flex-col gap-1">
                <h2>{vendor.name_of_bid}</h2>
                <p>Public Address: {vendor.public_address_of_account}</p>
                <p>Bid Amount: {vendor.bid_amount} ETH</p>
                <p>Bid Ask: {vendor.bid_ask} INR</p>
                <p>Bid Open: {vendor.bid_open ? "Yes" : "No"}</p>
            </div>
            <div>
                <button className="w-full p-2 mt-4 bg-blue-300 rounded-2xl text-gray-800 cursor-pointer hover:bg-blue-400" 
                    onClick={() => setBidEnabled(!bidEnabled)}>
                    {bidEnabled ? "Cancel" : "Place Your Bid"}
                </button>
                {bidEnabled && <div className="mt-1">
                    <input
                        type="number"
                        value={bid_want}
                        onChange={(e) => setBid_want(e.target.value)}
                        placeholder="Enter your Eth want"
                        className="border border-gray-300 p-2 rounded-2xl w-full"
                    />
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter your Bid Amount in INR"
                        className="border border-gray-300 p-2 rounded-2xl w-full mt-2"
                    />
                    <button
                        onClick={() => handleBid(bid_want, amount)}
                        className="w-full p-2 mt-4 bg-blue-300 rounded-2xl text-gray-800 cursor-pointer hover:bg-blue-400"
                    >
                        Bid
                    </button>
                </div>}
                <button
                    onClick={() => handleShowOffers()}
                    className="w-full p-2 mt-1 bg-blue-300 rounded-2xl text-gray-800 cursor-pointer hover:bg-blue-400"
                >
                    showOffers
                </button>
            </div>
        </div>
        {offers.length > 0 && offers.map((offer, idx) => <OfferCard key={idx} offer={offer} vendorID={vendor.vendor_id}
         vendor_address={vendor.public_address_of_account} />)}
    </div>
    );
};

export default BidCard;
