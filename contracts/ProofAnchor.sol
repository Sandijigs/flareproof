// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProofAnchor
 * @dev Smart contract for anchoring payment proof hashes on Flare blockchain
 * @notice This contract provides immutable proof-of-existence for ISO 20022 payment records
 */
contract ProofAnchor {
    /// @notice Structure to store proof records
    struct ProofRecord {
        bytes32 proofHash;
        address creator;
        uint256 timestamp;
        string proofId;
        bool exists;
    }

    /// @notice Mapping from proof hash to proof record
    mapping(bytes32 => ProofRecord) public proofs;

    /// @notice Mapping from proof ID to proof hash
    mapping(string => bytes32) public proofIdToHash;

    /// @notice Mapping from address to their proof count
    mapping(address => uint256) public userProofCount;

    /// @notice Array of all proof hashes (for enumeration)
    bytes32[] public proofHashes;

    /// @notice Emitted when a new proof is anchored
    event ProofAnchored(
        bytes32 indexed proofHash,
        string proofId,
        address indexed creator,
        uint256 timestamp,
        uint256 proofIndex
    );

    /// @notice Emitted when a proof is verified
    event ProofVerified(
        bytes32 indexed proofHash,
        address indexed verifier,
        uint256 timestamp
    );

    /**
     * @dev Anchor a new proof hash on the blockchain
     * @param proofHash The hash of the ISO 20022 proof document
     * @param proofId The human-readable proof identifier
     */
    function anchorProof(bytes32 proofHash, string calldata proofId) external {
        require(proofHash != bytes32(0), "Invalid proof hash");
        require(!proofs[proofHash].exists, "Proof already anchored");
        require(bytes(proofId).length > 0, "Proof ID required");
        require(bytes(proofId).length <= 64, "Proof ID too long");
        require(proofIdToHash[proofId] == bytes32(0), "Proof ID already used");

        uint256 proofIndex = proofHashes.length;

        proofs[proofHash] = ProofRecord({
            proofHash: proofHash,
            creator: msg.sender,
            timestamp: block.timestamp,
            proofId: proofId,
            exists: true
        });

        proofIdToHash[proofId] = proofHash;
        userProofCount[msg.sender]++;
        proofHashes.push(proofHash);

        emit ProofAnchored(proofHash, proofId, msg.sender, block.timestamp, proofIndex);
    }

    /**
     * @dev Verify a proof exists and get its details
     * @param proofHash The hash to verify
     * @return exists Whether the proof exists
     * @return creator Address that created the proof
     * @return timestamp When the proof was anchored
     * @return proofId The proof identifier
     */
    function verifyProof(bytes32 proofHash)
        external
        view
        returns (
            bool exists,
            address creator,
            uint256 timestamp,
            string memory proofId
        )
    {
        ProofRecord memory record = proofs[proofHash];
        return (record.exists, record.creator, record.timestamp, record.proofId);
    }

    /**
     * @dev Get proof details by proof ID
     * @param proofId The proof identifier
     * @return exists Whether the proof exists
     * @return proofHash The hash of the proof
     * @return creator Address that created the proof
     * @return timestamp When the proof was anchored
     */
    function getProofByProofId(string calldata proofId)
        external
        view
        returns (
            bool exists,
            bytes32 proofHash,
            address creator,
            uint256 timestamp
        )
    {
        bytes32 hash = proofIdToHash[proofId];
        if (hash == bytes32(0)) {
            return (false, bytes32(0), address(0), 0);
        }
        ProofRecord memory record = proofs[hash];
        return (record.exists, hash, record.creator, record.timestamp);
    }

    /**
     * @dev Get all proofs created by a specific address
     * @param user The address to query
     * @return userProofs Array of proof hashes created by the user
     */
    function getProofsByUser(address user) external view returns (bytes32[] memory) {
        uint256 count = userProofCount[user];
        bytes32[] memory userProofs = new bytes32[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < proofHashes.length && index < count; i++) {
            if (proofs[proofHashes[i]].creator == user) {
                userProofs[index] = proofHashes[i];
                index++;
            }
        }

        return userProofs;
    }

    /**
     * @dev Get the total number of anchored proofs
     * @return Total count of proofs
     */
    function getTotalProofCount() external view returns (uint256) {
        return proofHashes.length;
    }

    /**
     * @dev Emit a verification event (for tracking purposes)
     * @param proofHash The hash being verified
     */
    function logVerification(bytes32 proofHash) external {
        require(proofs[proofHash].exists, "Proof does not exist");
        emit ProofVerified(proofHash, msg.sender, block.timestamp);
    }
}
