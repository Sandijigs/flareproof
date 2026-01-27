# FlareProof

> Turn any Flare payment into audit-grade proof

FlareProof is an ISO 20022-compliant payment proof generator for the Flare blockchain. It enables users to generate verifiable, shareable payment proofs anchored on-chain.

![FlareProof Banner](https://via.placeholder.com/1200x400/3B82F6/FFFFFF?text=FlareProof+-+ISO+20022+Payment+Proofs+on+Flare)

## 🎯 Problem

African freelancers, SMEs, and businesses struggle with:
- ❌ No standardized way to prove crypto payments
- ❌ Manual reconciliation chaos
- ❌ Lack of audit-grade documentation
- ❌ Difficulty proving payments to clients/tax authorities

## ✨ Solution

FlareProof provides:
- ✅ **ISO 20022 Compliance**: Industry-standard payment messaging (pacs.008)
- ✅ **Blockchain Anchoring**: Immutable proof-of-existence on Flare
- ✅ **Shareable Links**: Anyone can verify without a wallet
- ✅ **Professional Exports**: PDF and XML downloads for accounting
- ✅ **Gas Efficient**: Powered by Flare's low transaction costs

## 🏆 Bounty Tracks

This project covers:
- **Track 5**: Proof-of-Payment Share Links ✅
- **Track 6**: Accounting Dashboard ✅

## 🛠 Tech Stack

- **Frontend**: Next.js 14 + TypeScript + App Router
- **Styling**: Tailwind CSS 3.4 + shadcn/ui
- **Web3**: Wagmi v2 + Viem v2 + RainbowKit v2
- **State**: TanStack React Query v5
- **Blockchain**: Flare Mainnet (Chain ID: 14) + Coston2 Testnet (Chain ID: 114)
- **PDF Generation**: jsPDF + jspdf-autotable
- **QR Codes**: qrcode.react

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- MetaMask or compatible Web3 wallet
- Flare (FLR) or Coston2 (C2FLR) testnet tokens

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/flareproof
cd flareproof

# Install dependencies
npm install

# Install shadcn/ui components (REQUIRED)
npx shadcn-ui@latest add button card dialog table toast skeleton badge input checkbox progress separator tabs dropdown-menu

# Copy environment variables
cp .env.example .env.local
```

### Environment Setup

Edit `.env.local` with your values:

```env
# Get your WalletConnect Project ID from https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Deploy ProofAnchor.sol contract first (see Contract Deployment below)
NEXT_PUBLIC_PROOF_ANCHOR_ADDRESS=0x...deployed_contract_address

# Your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Default chain (114 for Coston2 testnet, 14 for Flare mainnet)
NEXT_PUBLIC_DEFAULT_CHAIN=114
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📜 Contract Deployment

### Using Remix IDE (Recommended)

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create new file `ProofAnchor.sol`
3. Copy contract code from `contracts/ProofAnchor.sol`
4. Compile with Solidity 0.8.20+
5. Deploy to network:

**Coston2 Testnet (for testing):**
- Network Name: Coston2
- RPC URL: `https://coston2-api.flare.network/ext/C/rpc`
- Chain ID: 114
- Currency: C2FLR
- Explorer: https://coston2-explorer.flare.network

**Flare Mainnet (for production):**
- Network Name: Flare
- RPC URL: `https://flare-api.flare.network/ext/C/rpc`
- Chain ID: 14
- Currency: FLR
- Explorer: https://flare-explorer.flare.network

6. Get Testnet Tokens:
   - Coston2 Faucet: https://faucet.flare.network/coston2

7. Copy deployed address to `.env.local`:
```env
NEXT_PUBLIC_PROOF_ANCHOR_ADDRESS=0x...your_deployed_address
```

### Verify Contract (Optional)

After deployment, verify on block explorer for transparency:
1. Go to explorer (coston2-explorer.flare.network or flare-explorer.flare.network)
2. Find your contract address
3. Click "Verify & Publish"
4. Upload `ProofAnchor.sol` and verify

## 📖 Usage Guide

### 1. Connect Wallet

- Click "Connect Wallet"
- Select your wallet (MetaMask, WalletConnect, etc.)
- Approve the connection
- Ensure you're on Flare or Coston2 network

### 2. View Transactions

- Dashboard automatically loads your recent transactions
- Filter by date, type, or status
- See transaction details including amount, timestamp, gas

### 3. Generate Proof

- Select one or more transactions (checkbox)
- Click "Generate Proof"
- Review transaction summary
- Confirm proof generation

### 4. Anchor on Blockchain

- After generation, click "Anchor Proof"
- Approve the transaction in your wallet
- Wait for confirmation (usually < 10 seconds on Flare)
- Proof is now immutably recorded on-chain

### 5. Share Proof

- Copy the shareable link
- Share via email, messaging, or QR code
- Recipients can verify WITHOUT connecting a wallet
- Proof shows as "Verified ✓" if anchored

### 6. Download Exports

- **PDF**: Professional proof document
- **XML**: ISO 20022 compliant format for accounting software
- **JSON**: Raw proof data for developers

## 🏗 Architecture

```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
         ├──> Flare RPC (Read Transactions)
         │
         ├──> ProofAnchor Contract (Write Proofs)
         │
         └──> Local Storage (Cache Proofs)

User Flow:
1. Connect Wallet → 2. Fetch Transactions → 3. Generate ISO 20022 Proof
4. Anchor Hash On-Chain → 5. Share Link → 6. Anyone Verifies
```

## 📁 Project Structure

```
flareproof/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing/Dashboard page
│   ├── globals.css             # Global styles
│   ├── dashboard/              # Transaction dashboard
│   ├── proof/[id]/             # Public verification page
│   └── api/                    # API routes (if needed)
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── providers.tsx           # Wagmi/RainbowKit/Query providers
│   ├── transactions/           # Transaction components
│   ├── proof/                  # Proof components
│   └── layout/                 # Layout components
├── hooks/
│   ├── use-transactions.ts     # Fetch transactions
│   ├── use-proof-generator.ts  # Generate proofs
│   └── use-anchor-proof.ts     # Anchor proofs
├── lib/
│   ├── chains.ts               # Flare chain definitions
│   ├── wagmi-config.ts         # Wagmi configuration
│   ├── iso20022.ts             # ISO message generator
│   ├── pdf-generator.ts        # PDF proof generator
│   ├── utils.ts                # Utilities
│   └── constants.ts            # App constants
├── types/
│   ├── transaction.ts          # Transaction types
│   ├── proof.ts                # Proof types
│   └── iso20022.ts             # ISO 20022 types
├── contracts/
│   └── ProofAnchor.sol         # Smart contract
└── public/                     # Static assets
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Wallet connects successfully
- [ ] Transactions load from Flare
- [ ] Can select multiple transactions
- [ ] Proof generates with correct ISO 20022 format
- [ ] Hash anchors successfully on blockchain
- [ ] Public verification page loads without wallet
- [ ] PDF downloads correctly
- [ ] XML is valid ISO 20022 format
- [ ] QR code scans to correct URL
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark mode works correctly

### Test on Coston2 Testnet

1. Get C2FLR from faucet
2. Make test transactions
3. Generate and anchor proofs
4. Verify everything works before mainnet

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# NEXT_PUBLIC_PROOF_ANCHOR_ADDRESS
# NEXT_PUBLIC_APP_URL
```

### Environment Variables for Production

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_PROOF_ANCHOR_ADDRESS=0x...mainnet_contract
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_DEFAULT_CHAIN=14  # Use Flare Mainnet
```

## 🎥 Demo

- **Live Demo**: [https://flareproof.vercel.app](https://flareproof.vercel.app)
- **Video Walkthrough**: [YouTube Link](#)
- **Contract on Coston2**: [Explorer Link](#)

## 📊 Features Breakdown

### Track 5: Proof-of-Payment Share Links ✅

- ✅ Generate shareable verification links
- ✅ QR code generation for easy sharing
- ✅ Public verification page (no wallet required)
- ✅ Real-time blockchain verification
- ✅ Transaction details display

### Track 6: Accounting Dashboard ✅

- ✅ Transaction history with filtering
- ✅ ISO 20022 compliant export (XML)
- ✅ PDF proof generation
- ✅ Transaction statistics
- ✅ Audit-grade documentation

## 🔐 Security

- ✅ No private keys stored
- ✅ Read-only blockchain access for transactions
- ✅ Smart contract is immutable after deployment
- ✅ Proofs cannot be deleted or modified
- ✅ Open source and verifiable

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- **Flare Network** for the blockchain infrastructure
- **ProofRails** for the bounty opportunity
- **shadcn/ui** for the component library
- **RainbowKit** for wallet integration

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/flareproof/issues)
- **Twitter**: [@flareproof](#)
- **Email**: support@flareproof.xyz

---

**Built with ❤️ for the Flare Africa Builder Bounty**

*Transform your Flare payments into audit-grade proof of payment records*
