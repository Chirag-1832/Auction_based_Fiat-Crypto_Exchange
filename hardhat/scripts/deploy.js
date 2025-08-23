// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  console.log(" Deploying EscrowP2P...");

  // Get the contract factory
  const EscrowP2P = await hre.ethers.getContractFactory("EscrowP2P");

  // Deploy contract
  const escrow = await EscrowP2P.deploy();

  // Wait until deployment is mined
  await escrow.waitForDeployment();

  // Print contract address
  console.log("EscrowP2P deployed at:", await escrow.getAddress());
  console.log("Mediator (msg.sender) is:", (await hre.ethers.provider.getSigner()).address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
