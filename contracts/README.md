# FlareProof Smart Contracts

## ProofAnchor.sol

The main smart contract for anchoring ISO 20022 payment proof hashes on Flare blockchain.

### Features

- **Immutable Anchoring**: Store proof hashes permanently on-chain
- **Proof Verification**: Verify proofs exist and retrieve their metadata
- **User Tracking**: Track all proofs created by each address
- **Event Emission**: Emit events for indexing and monitoring

### Deployment

#### Using Remix IDE

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create new file `ProofAnchor.sol` and paste the contract code
3. Compile with Solidity 0.8.20 or higher
4. Deploy to Flare network:
   - **Coston2 Testnet (Chain ID: 114)**
     - RPC: `https://coston2-api.flare.network/ext/C/rpc`
     - Explorer: `https://coston2-explorer.flare.network`
   - **Flare Mainnet (Chain ID: 14)**
     - RPC: `https://flare-api.flare.network/ext/C/rpc`
     - Explorer: `https://flare-explorer.flare.network`

5. After deployment, copy the contract address to `.env.local`:
   ```
   NEXT_PUBLIC_PROOF_ANCHOR_ADDRESS=0x...your_deployed_address
   ```

#### Using Hardhat (Optional)

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat
npx hardhat init

# Deploy script (create scripts/deploy.ts)
npx hardhat run scripts/deploy.ts --network coston2
```

### Contract Functions

#### Write Functions

- `anchorProof(bytes32 proofHash, string proofId)` - Anchor a new proof
- `logVerification(bytes32 proofHash)` - Log proof verification event

#### Read Functions

- `verifyProof(bytes32 proofHash)` - Get proof details by hash
- `getProofByProofId(string proofId)` - Get proof details by ID
- `getProofsByUser(address user)` - Get all proofs by user
- `getTotalProofCount()` - Get total anchored proofs

### Events

- `ProofAnchored` - Emitted when proof is anchored
- `ProofVerified` - Emitted when proof is verified

### Gas Estimates

- Anchor Proof: ~100,000 gas
- Verify Proof: View function (no gas)
- Get Proofs by User: View function (no gas)

### Security Considerations

- Proofs are immutable once anchored
- Proof IDs must be unique
- Maximum proof ID length: 64 characters
- Hash must be non-zero bytes32
