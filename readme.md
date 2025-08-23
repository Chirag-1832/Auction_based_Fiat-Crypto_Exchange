## P2P Fiat-Crypto Exchange

# P2P Escrow DApp

A peer-to-peer escrow marketplace where sellers lock ETH as liquidity, buyers place INR-denominated bids, sellers manually accept bids to move funds into escrow, and a mediator later releases escrow to the buyer; Web2 (Express) tracks listings/offers and Web3 (Solidity) secures funds via MetaMask.

## Quickstart (single flow)

1) Fork this repo, then clone and enter it:
git clone <your-fork-url>
cd <project-folder>

2) Hardhat setup and compile:
cd hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install
npx hardhat compile

3) Run a local chain (keep this terminal open):
npx hardhat node

4) Deploy the contract (new terminal, still inside hardhat/):
npx hardhat run scripts/deploy.js --network localhost
# Copy the printed contract address for the frontend

5) Backend (Express) setup and run (from project root or backend folder you use):
# if your server lives at ./server or ./backend, cd there; otherwise stay at root where your Express app file is
npm install
# start the API that your frontend calls (adjust script/filename as per your package.json)
npm run dev
# or
node index.js
# Your API should serve endpoints like /createBidItem, /makeBid/:vendorId, /acceptBid/:vendorId, /releaseEscrow/:escrowId

6) Frontend setup and run:
cd ../frontend
npm install
# start your dev server (use the one your app uses)
npm run dev  # (Vite)  — typically http://localhost:5173
# or
npm start    # (CRA)   — typically http://localhost:3000
# In your frontend config/constants, set CONTRACT_ADDRESS to the one from step 4 and ensure API base URL points to your Express server

## Useful commands (any time)

# recompile contracts
cd hardhat && npx hardhat compile

# run tests (if you add them)
npx hardhat test

# show local accounts
npx hardhat accounts

# redeploy after changes
npx hardhat run scripts/deploy.js --network localhost

# restart the local chain if needed
Ctrl+C the node, then: npx hardhat node
