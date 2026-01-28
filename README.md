# FlareProof

**Transform blockchain transactions into institutional-grade payment documentation on Flare.**

FlareProof is an enterprise payment proof generator that converts Flare Network transactions into ISO 20022-compliant financial records with cryptographically-secured blockchain anchoring. Built to bridge the gap between blockchain transparency and traditional African finance requirements.

---

## What It Does

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Connect    │      │   Select     │      │   Generate   │      │   Anchor &   │
│   Wallet     │ ───▶ │   Payments   │ ───▶ │   ISO Proof  │ ───▶ │   Share      │
└──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
```

1. **Connect Wallet** - Securely connect your Web3 wallet to retrieve Flare transaction history
2. **Select Transactions** - Choose specific payments to consolidate into a verifiable proof document
3. **Generate ISO 20022 Proof** - Create pacs.008 compliant payment message with cryptographic hash
4. **Anchor On-Chain** - Record proof hash immutably on Flare blockchain
5. **Export & Share** - Download PDF/XML or share tamper-proof verification URL

---

## 🎯 The Problem (Africa Context)

Across Africa, where blockchain adoption is exploding (**Nigeria processes $56B+ in annual crypto transactions**), a critical infrastructure gap exists:

- ❌ **Tax Authorities** don't accept blockchain explorer screenshots as valid payment proof
- ❌ **Auditors and Accountants** can't interpret raw transaction hashes
- ❌ **Banks and Regulators** require ISO 20022 compliant documentation
- ❌ **Legal Disputes** lack acceptable evidence for crypto transactions
- ❌ **Cross-Border Payments** have no standardized proof mechanism

**Result**: Blockchain payments are excluded from formal financial systems, hindering business adoption and regulatory compliance.

---

## ✅ The Solution

FlareProof generates **ISO 20022 pacs.008 compliant payment proofs** that:

✅ **Meet Banking Standards** - Same format banks use globally for financial messaging
✅ **Anchored On-Chain** - Cryptographic hash stored permanently on Flare for verification
✅ **Universally Accessible** - Verification links work WITHOUT wallet or blockchain knowledge
✅ **Audit-Ready** - Professional PDF/XML exports integrate with accounting software
✅ **Cost-Effective** - Powered by Flare's low transaction costs (fractions of a cent)

---

## Quick Start

### Prerequisites

- **Node.js 18+** with npm
- **Flare Wallet** (MetaMask, Rabby, etc.) with:
  - Some FLR for gas (for anchoring proofs)
  - Transaction history on Flare network

### 1. Clone and Setup

```bash
git clone https://github.com/Sandijigs/flareproof.git
cd flareproof
npm install
```

### 2. Environment Configuration

Create `.env` in the project root:

```env
# Required
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_PROOF_ANCHOR_ADDRESS=0xD4bc1A02aF9F2990698D8D13Be2F88F10B65F5dF
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_CHAIN=114

# Optional (for contract deployment)
PRIVATE_KEY=your_wallet_private_key_for_deployment
```

**Get WalletConnect Project ID**: https://cloud.walletconnect.com/

### 3. Run Development Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

### 4. Test It!

1. Click **"Connect Wallet"** and switch to Flare/Coston2 network
2. View your transaction history automatically loaded
3. **Select transactions** using checkboxes
4. Click **"Generate Proof"** to create ISO 20022 message
5. Click **"Anchor Proof"** and sign the transaction
6. **Download PDF/XML** or **copy verification link** to share
7. Open verification link in incognito mode - works without wallet!

---

## 📁 Project Structure

```
flareproof/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with Web3 providers
│   ├── page.tsx                  # Landing + Dashboard page
│   ├── globals.css               # Tailwind styles
│   └── proof/[id]/               # Public verification page (no wallet)
│       └── page.tsx
├── components/
│   ├── providers.tsx             # Wagmi + RainbowKit + ReactQuery setup
│   ├── transaction-table.tsx    # Transaction list with selection
│   ├── proof-generation-modal.tsx # 3-step proof generation flow
│   ├── proof-list.tsx            # View saved proofs
│   └── ui/                       # shadcn/ui components
├── hooks/
│   ├── use-transactions.ts       # Fetch Flare transaction history
│   ├── use-proof-generator.ts    # Generate ISO 20022 messages
│   └── use-anchor-proof.ts       # Smart contract interaction
├── lib/
│   ├── chains.ts                 # Flare/Coston2 chain definitions
│   ├── wagmi-config.ts           # Wagmi v2 configuration
│   ├── iso20022.ts               # ISO 20022 pacs.008 XML generator
│   ├── pdf-generator.ts          # jsPDF proof document creator
│   ├── constants.ts              # Block explorers, RPC URLs
│   └── utils.ts                  # Utility functions
├── contracts/
│   └── ProofAnchor.sol           # Smart contract (Solidity 0.8.20)
├── types/
│   ├── transaction.ts            # Transaction type definitions
│   ├── proof.ts                  # Proof data structures
│   └── iso20022.ts               # ISO message types
└── scripts/
    └── deploy.js                 # Hardhat deployment script
```

---

## 🔗 API Reference (Frontend Hooks)

### `useTransactions()`

```typescript
const { data: transactions, isLoading } = useTransactions();
// Returns: Array of Flare transactions for connected wallet
```

### `useProofGenerator()`

```typescript
const { generateProof } = useProofGenerator();
const proof = await generateProof(selectedTransactions);
// Returns: { id, hash, iso20022Message, transactions }
```

### `useAnchorProof()`

```typescript
const { mutate: anchorProof } = useAnchorProof();
anchorProof({ proofHash: "0x...", proofId: "FP-2026-0126-XWN8" });
// Anchors proof hash on ProofAnchor smart contract
```

### `useProofById(proofId)`

```typescript
const { data: proof } = useProofById("FP-2026-0126-XWN8");
// Returns: { exists, proofHash, creator, timestamp }
```

---

## 🛠 Configuration Reference

### Environment Variables

| Variable                               | Required | Description                                           |
| -------------------------------------- | -------- | ----------------------------------------------------- |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | ✅       | WalletConnect project ID from cloud.walletconnect.com |
| `NEXT_PUBLIC_PROOF_ANCHOR_ADDRESS`     | ✅       | Deployed ProofAnchor contract address                 |
| `NEXT_PUBLIC_APP_URL`                  | ✅       | Application URL for verification links                |
| `NEXT_PUBLIC_DEFAULT_CHAIN`            | ✅       | `114` (Coston2) or `14` (Flare mainnet)               |
| `PRIVATE_KEY`                          | ❌       | Wallet private key (only for contract deployment)     |

### Network Details

**Coston2 Testnet:**

- RPC: `https://coston2-api.flare.network/ext/C/rpc`
- Chain ID: `114`
- Currency: C2FLR
- Explorer: https://coston2-explorer.flare.network
- Faucet: https://faucet.flare.network/coston2

**Flare Mainnet:**

- RPC: `https://flare-api.flare.network/ext/C/rpc`
- Chain ID: `14`
- Currency: FLR
- Explorer: https://flare-explorer.flare.network

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# - NEXT_PUBLIC_PROOF_ANCHOR_ADDRESS
# - NEXT_PUBLIC_APP_URL (use your Vercel URL)
# - NEXT_PUBLIC_DEFAULT_CHAIN=14 (for mainnet)
```

### Deploy Smart Contract

**Using Hardhat (from this repo):**

```bash
# Install Hardhat dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Create .env with PRIVATE_KEY (see step 2 above)

# Deploy to Coston2 testnet
npx hardhat run scripts/deploy.js --network coston2

# Copy the deployed address to your .env file
```

**Using Remix IDE (alternative):**

1. Open https://remix.ethereum.org/
2. Create `ProofAnchor.sol` and paste code from `contracts/ProofAnchor.sol`
3. Compile with Solidity 0.8.20+
4. Deploy using Injected Provider (MetaMask) on Coston2 or Flare
5. Copy deployed address to `.env`

---

## 🎯 Use Cases (African Context)

### 1. Small Business Tax Compliance

**Scenario**: Nigerian fashion designer accepts crypto from diaspora customers
**Solution**: Generate ISO 20022 proofs that satisfy Nigerian Federal Inland Revenue Service (FIRS) for tax filing

### 2. Cross-Border Trade Documentation

**Scenario**: Ghanaian farmer co-op receives payment from South African importer
**Solution**: Provide legally-recognized proof of payment for customs and dispute resolution

### 3. Remittance Income Verification

**Scenario**: Family receives crypto remittances and needs proof for visa/loan application
**Solution**: Generate audit-grade documentation proving legitimate income source

### 4. Fintech Compliance Automation

**Scenario**: Neo-bank building in Kenya needs compliant records for all crypto transactions
**Solution**: Integrate FlareProof API to auto-generate proofs, reducing regulatory risk

---

## 🗺 Possible Roadmap

### v1.1 - Enhanced Features

- [ ] QR code sharing for mobile verification
- [ ] Email export of proofs
- [ ] Batch proof generation for multiple wallet addresses
- [ ] Additional ISO 20022 message types (pain.001, camt.053)

### v1.2 - Enterprise

- [ ] API access for fintech integrations
- [ ] Multi-wallet management dashboard
- [ ] CSV/JSON export for accounting software
- [ ] Webhook notifications for proof anchoring

### v1.3 - Compliance & Scale

- [ ] Multi-chain support (Ethereum, Polygon, etc.)
- [ ] Proof verification API for third parties
- [ ] Automated tax reporting integrations
- [ ] Localization (French, Swahili, Arabic)

---

## 🏆 Built For

This project addresses real-world documentation gaps preventing blockchain adoption in African economies where trust, compliance, and audit-ready records are critical for business legitimacy.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🔗 Resources

- **Live Demo**: https://flareproof-6myyt9vyt-oghenerukevwe-sandra-idjigheres-projects.vercel.app
- **Smart Contract**: `0xD4bc1A02aF9F2990698D8D13Be2F88F10B65F5dF` (Coston2)
- **Flare Documentation**: https://docs.flare.network
- **ISO 20022 Standard**: https://www.iso20022.org
- **ProofRails Bounty**: https://proofrails.com

---

## 👥 Team

Built by **Sandra Idjighere** for the Flare Africa Builder Bounty

---

## 📧 Support

- **GitHub Issues**: https://github.com/Sandijigs/flareproof/issues
- **Twitter**: [@SandraIdjighere](#)

---

**🌍 Built with ❤️ for African blockchain adoption**

_Bridging blockchain transparency with traditional finance requirements_
