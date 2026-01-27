#!/bin/bash

echo "🚀 FlareProof Contract Deployment Script"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Step 1: Installing Hardhat dependencies..."
npm install --save-dev hardhat@^2.19.4 @nomicfoundation/hardhat-toolbox@^4.0.0 dotenv@^16.3.1

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

echo "🔧 Step 2: Deploying ProofAnchor contract to Coston2 Testnet..."
echo ""

npx hardhat run scripts/deploy.js --network coston2

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Deployment failed!"
    echo ""
    echo "Common issues:"
    echo "1. Make sure you have C2FLR tokens in your wallet"
    echo "   Get them from: https://faucet.flare.network/coston2"
    echo ""
    echo "2. Check that your PRIVATE_KEY is set correctly in .env file"
    echo "   (without the 0x prefix)"
    echo ""
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Copy the contract address shown above"
echo "2. Update your .env file with the address"
echo "3. Restart your dev server: npm run dev"
echo ""
