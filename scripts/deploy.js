const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ProofAnchor contract to", hre.network.name);
  console.log("⏳ Please wait...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying from address:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "FLR\n");

  if (balance === 0n) {
    console.error("❌ Error: Account has no balance!");
    console.log("Please fund your account with testnet tokens from:");
    console.log("https://faucet.flare.network/coston2\n");
    process.exit(1);
  }

  // Deploy the contract
  console.log("📦 Deploying ProofAnchor contract...");
  const ProofAnchor = await hre.ethers.getContractFactory("ProofAnchor");
  const proofAnchor = await ProofAnchor.deploy();

  await proofAnchor.waitForDeployment();

  const contractAddress = await proofAnchor.getAddress();

  console.log("\n✅ ProofAnchor deployed successfully!");
  console.log("📍 Contract address:", contractAddress);
  console.log("\n📋 Next steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Update your .env file:");
  console.log(`   NEXT_PUBLIC_PROOF_ANCHOR_ADDRESS=${contractAddress}`);
  console.log("3. Restart your dev server: npm run dev\n");

  // Verify on block explorer
  const network = hre.network.name;
  if (network === "coston2") {
    console.log("🔍 View on Coston2 Explorer:");
    console.log(`https://coston2-explorer.flare.network/address/${contractAddress}\n`);
  } else if (network === "flare") {
    console.log("🔍 View on Flare Explorer:");
    console.log(`https://flare-explorer.flare.network/address/${contractAddress}\n`);
  }

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: network,
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
  };

  fs.writeFileSync(
    `deployment-${network}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`💾 Deployment info saved to deployment-${network}.json\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed!");
    console.error(error);
    process.exit(1);
  });
