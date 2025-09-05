# P2P Escrow DApp  

A peer-to-peer escrow marketplace where sellers lock ETH as liquidity, buyers place INR-denominated bids, sellers manually accept bids to move funds into escrow, and a mediator later releases escrow to the buyer; Web2 (Express) tracks listings/offers and Web3 (Solidity) secures funds via MetaMask.  

## Getting Started  

### Prerequisites  
- Node.js (v16 or later)  
- npm or yarn  
- Hardhat (installed via npm)  
- MetaMask browser extension
- vite

### Build  
Clone the repo and install dependencies for each part:  

```bash
git clone <your-fork-url>
cd project-folder
```
## For Contracts

```bash

cd hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install
npx hardhat compile

```
## Hardhat for Comipiling and Backend Logic

```bash
cd hardhat
npx hardhat run scripts/deploy.js --network localhost
node app.js
```

Change the contract address in Code and store the Mediator address

## Start a local Hardhat blockchain:

```bash
cd hardhat
npx hardhat node
```

## Run frontend:

```bash
cd ../frontend
npm run dev
```

## Test the routes with PostMan or curl commands

- curl http://localhost:3000/createBidItem
- curl http://localhost:3000/makeBid/1
- curl http://localhost:3000/acceptBid/1
- curl http://localhost:3000/releaseEscrow/1

## Logs 

- Hardhat node shows contract events.
- Backend server logs request/response.
- Frontend logs appear in browser console.

## Future Improvements

- Add unit tests for smart contracts
- Extend backend with Postgres for persistence
- Implement mediator dashboard for dispute resolution
- Support multiple tokens (ERC20) instead of ETH only
- Add Docker setup for full-stack containerization

### Author
Master OOgway


