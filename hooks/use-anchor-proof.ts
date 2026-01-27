'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { parseAbi } from 'viem'

// Get contract address from environment
const PROOF_ANCHOR_ADDRESS = (process.env.NEXT_PUBLIC_PROOF_ANCHOR_ADDRESS ||
  '0x0000000000000000000000000000000000000000') as `0x${string}`

// Contract ABI
const proofAnchorAbi = parseAbi([
  'function anchorProof(bytes32 proofHash, string proofId) external',
  'function verifyProof(bytes32 proofHash) view returns (bool exists, address creator, uint256 timestamp, string proofId)',
  'function getProofByProofId(string proofId) view returns (bool exists, bytes32 proofHash, address creator, uint256 timestamp)',
  'function getProofsByUser(address user) view returns (bytes32[] memory)',
  'function getTotalProofCount() view returns (uint256)',
  'function logVerification(bytes32 proofHash) external',
  'event ProofAnchored(bytes32 indexed proofHash, string proofId, address indexed creator, uint256 timestamp, uint256 proofIndex)',
  'event ProofVerified(bytes32 indexed proofHash, address indexed verifier, uint256 timestamp)',
])

/**
 * Hook to anchor proof hash on Flare blockchain
 * @returns Mutation for anchoring proofs
 */
export function useAnchorProof() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  return useMutation({
    mutationFn: async ({
      proofHash,
      proofId,
    }: {
      proofHash: `0x${string}`
      proofId: string
    }) => {
      if (!walletClient || !address || !publicClient) {
        throw new Error('Wallet not connected')
      }

      if (PROOF_ANCHOR_ADDRESS === '0x0000000000000000000000000000000000000000') {
        throw new Error(
          'Contract address not configured. Please deploy the ProofAnchor contract and set NEXT_PUBLIC_PROOF_ANCHOR_ADDRESS'
        )
      }

      try {
        // Simulate the transaction first to catch errors
        const { request } = await publicClient.simulateContract({
          address: PROOF_ANCHOR_ADDRESS,
          abi: proofAnchorAbi,
          functionName: 'anchorProof',
          args: [proofHash, proofId],
          account: address,
        })

        // Send the transaction
        const hash = await walletClient.writeContract(request)

        // Wait for confirmation
        const receipt = await publicClient.waitForTransactionReceipt({
          hash,
          confirmations: 1,
        })

        if (receipt.status === 'reverted') {
          throw new Error('Transaction reverted')
        }

        return {
          txHash: hash,
          blockNumber: receipt.blockNumber,
          status: receipt.status,
        }
      } catch (error: any) {
        console.error('Error anchoring proof:', error)

        if (error.message.includes('Proof already anchored')) {
          throw new Error('This proof has already been anchored on the blockchain')
        }

        if (error.message.includes('Proof ID already used')) {
          throw new Error('This proof ID is already in use')
        }

        throw new Error(error.shortMessage || error.message || 'Failed to anchor proof')
      }
    },
  })
}

/**
 * Hook to verify a proof on the blockchain
 * @returns Mutation for verifying proofs
 */
export function useVerifyProof() {
  const publicClient = usePublicClient()

  return useMutation({
    mutationFn: async (proofHash: `0x${string}`) => {
      if (!publicClient) throw new Error('Client not available')

      if (PROOF_ANCHOR_ADDRESS === '0x0000000000000000000000000000000000000000') {
        throw new Error('Contract address not configured')
      }

      try {
        const result = await publicClient.readContract({
          address: PROOF_ANCHOR_ADDRESS,
          abi: proofAnchorAbi,
          functionName: 'verifyProof',
          args: [proofHash],
        })

        return {
          exists: result[0],
          creator: result[1],
          timestamp: Number(result[2]),
          proofId: result[3],
          isValid: result[0],
        }
      } catch (error) {
        console.error('Error verifying proof:', error)
        throw new Error('Failed to verify proof')
      }
    },
  })
}

/**
 * Hook to get proof details by proof ID
 * @param proofId - The proof ID to lookup
 * @returns Query result with proof details
 */
export function useProofById(proofId: string | null) {
  const publicClient = usePublicClient()

  return useQuery({
    queryKey: ['proof', proofId],
    queryFn: async () => {
      if (!publicClient || !proofId) return null

      if (PROOF_ANCHOR_ADDRESS === '0x0000000000000000000000000000000000000000') {
        throw new Error('Contract address not configured')
      }

      try {
        const result = await publicClient.readContract({
          address: PROOF_ANCHOR_ADDRESS,
          abi: proofAnchorAbi,
          functionName: 'getProofByProofId',
          args: [proofId],
        })

        if (!result[0]) {
          return null
        }

        return {
          exists: result[0],
          proofHash: result[1],
          creator: result[2],
          timestamp: Number(result[3]),
        }
      } catch (error) {
        console.error('Error fetching proof by ID:', error)
        return null
      }
    },
    enabled: !!publicClient && !!proofId,
    staleTime: 60000, // 1 minute
  })
}

/**
 * Hook to get all proofs created by the current user
 * @returns Query result with user's proof hashes
 */
export function useUserProofs() {
  const { address } = useAccount()
  const publicClient = usePublicClient()

  return useQuery({
    queryKey: ['userProofs', address],
    queryFn: async () => {
      if (!publicClient || !address) return []

      if (PROOF_ANCHOR_ADDRESS === '0x0000000000000000000000000000000000000000') {
        return []
      }

      try {
        const result = await publicClient.readContract({
          address: PROOF_ANCHOR_ADDRESS,
          abi: proofAnchorAbi,
          functionName: 'getProofsByUser',
          args: [address],
        })

        return result as `0x${string}`[]
      } catch (error) {
        console.error('Error fetching user proofs:', error)
        return []
      }
    },
    enabled: !!publicClient && !!address,
    staleTime: 30000, // 30 seconds
  })
}
