import express from "express";
import { ethers } from "ethers";
import {mockBid} from "./mockBid.js"
import fs from "fs";
import cors from "cors";



const PORT = 3000;
// const RPC_URL = "http://127.0.0.1:8545";   
// const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 

// const abi = JSON.parse(fs.readFileSync("./artifacts/contracts/Escrow.sol/EscrowP2P.json")).abi;

const app = express();
app.use(express.json());
app.use(cors());

// const provider = new ethers.JsonRpcProvider(RPC_URL);

const vendors = [];
const escrow = []

app.post("/createBidItem", (req, res) => {
  const { sellerAddress, amount, bidAsk } = req.body;

  const newBidItem = {
    vendor_id: vendors.length + 1,
    name_of_bid: `Vendor ${vendors.length + 1}`,
    public_address_of_account: sellerAddress,
    bids: [],
    bid_open: true,
    payment_complete: false,
    bid_amount: amount,
    bid_ask: bidAsk
  };

  vendors.push(newBidItem);
  res.status(201).json(newBidItem);

});

app.get("/getBidItems", (req, res) => {
  res.json(vendors);
});

app.get("/getBidItem/:vendorId", (req,res) => {
  const { vendorId } = req.params;
  const vendor = vendors.find(v => v.vendor_id === parseInt(vendorId));
  if (!vendor) return res.status(404).json({ error: "Vendor not found" });
  res.json(vendor);
})

app.post("/makeBid/:vendorId", (req, res) => {
  const { buyerAddress, amount, bid_want } = req.body;
  const { vendorId } = req.params;

  const vendor = vendors.find(v =>v.vendor_id === parseInt(vendorId));
  if (!vendor) return res.status(404).json({ error: "Vendor not found" });
  if (bid_want > vendor.bid_amount) {
      return res.status(400).json({ error: "Requested ETH exceeds seller's available amount" });
  }

  vendor.bids.push({ bid_want: bid_want, buyer_address: buyerAddress, buyer_bid_amount: amount });
  res.status(201).json(vendor);
});

app.get("/showOffers/:vendorId", (req, res) => {
  const { vendorId } = req.params;

  const vendor = vendors.find(v => v.vendor_id === parseInt(vendorId));
  if (!vendor) return res.status(404).json({ error: "Vendor not found" });

  res.json(vendor.bids);
});

app.post("/acceptBid/:vendorId", (req, res) => {
  const { vendorId } = req.params;
  const { buyerAddress, bid_want } = req.body;

  const vendor = vendors.find(v => v.vendor_id === parseInt(vendorId));
  if (!vendor) return res.status(404).json({ error: "Vendor not found" });

  const bid = vendor.bids.find(b => b.buyer_address === buyerAddress && b.bid_want === bid_want);
  if (!bid) return res.status(404).json({ error: "Bid not found" });

  vendor.bids = vendor.bids.filter(b => !(b.buyer_address === buyerAddress && b.bid_want === bid_want));

  vendor.bid_ask = (vendor.bid_ask/vendor.bid_amount)*(vendor.bid_amount - bid_want);

  vendor.bid_amount -= bid_want;

  if(vendor.bid_amount <= 0) {
    vendor.bid_open = false;
  }
  

  const escrowItem = {
    escrowId: escrow.length + 1,   
    sellerAddress: vendor.public_address_of_account,
    buyerAddress: buyerAddress,
    amountINR: bid.buyer_bid_amount,
    amountETH: bid_want,
    open: true
  };

  escrow.push(escrowItem);

  res.json({ message: "Bid accepted", amountINR: bid.buyer_bid_amount });
});

app.get("/escrow", (req, res) => {
  res.json(escrow);
});

app.post("/releaseEscrow/:escrowId", (req, res) => {
  const { escrowId } = req.params;

  const escrowItem = escrow.find(e => e.escrowId === parseInt(escrowId));
  if (!escrowItem) return res.status(404).json({ error: "Escrow not found" });
  if (!escrowItem.open) return res.status(400).json({ error: "Escrow already closed" });

  escrowItem.open = false;

  res.json({
    message: "Payment confirmed, ETH released to buyer",
    escrowId: escrowItem.escrowId,
    sellerAddress: escrowItem.sellerAddress,
    buyerAddress: escrowItem.buyerAddress,
    amountETH: escrowItem.amountETH,
    amountINR: escrowItem.amountINR
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
