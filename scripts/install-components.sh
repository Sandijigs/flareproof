#!/bin/bash

# FlareProof - Component Installation Script
# This script installs all required shadcn/ui components

echo "🚀 Installing FlareProof UI Components..."
echo ""

# Check if npx is available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx is not installed. Please install Node.js and npm first."
    exit 1
fi

echo "📦 Installing shadcn/ui components..."
echo ""

# Array of components to install
components=(
    "button"
    "card"
    "dialog"
    "table"
    "toast"
    "skeleton"
    "badge"
    "input"
    "checkbox"
    "progress"
    "separator"
    "tabs"
    "dropdown-menu"
)

# Install each component
for component in "${components[@]}"; do
    echo "Installing $component..."
    npx shadcn-ui@latest add "$component" --yes --overwrite
    echo ""
done

echo "✅ All components installed successfully!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env.local"
echo "2. Add your WalletConnect Project ID"
echo "3. Deploy ProofAnchor.sol contract"
echo "4. Add contract address to .env.local"
echo "5. Run 'npm run dev' to start development server"
echo ""
echo "See SETUP.md for detailed instructions."
