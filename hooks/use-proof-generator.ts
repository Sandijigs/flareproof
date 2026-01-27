'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { keccak256, toBytes } from 'viem'
import { Transaction } from '@/types/transaction'
import { Proof } from '@/types/proof'
import { generatePacs008, generateXML } from '@/lib/iso20022'
import { MAX_TRANSACTIONS_PER_PROOF, MIN_TRANSACTIONS_PER_PROOF } from '@/lib/constants'

/**
 * Hook to generate ISO 20022 payment proofs from transactions
 * @returns Mutation for generating proofs
 */
export function useProofGenerator() {
  const { address } = useAccount()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (transactions: Transaction[]): Promise<Proof> => {
      if (!address) {
        throw new Error('Wallet not connected')
      }

      if (transactions.length < MIN_TRANSACTIONS_PER_PROOF) {
        throw new Error(`At least ${MIN_TRANSACTIONS_PER_PROOF} transaction required`)
      }

      if (transactions.length > MAX_TRANSACTIONS_PER_PROOF) {
        throw new Error(
          `Maximum ${MAX_TRANSACTIONS_PER_PROOF} transactions allowed per proof`
        )
      }

      try {
        // Generate ISO 20022 message
        const iso20022 = generatePacs008(transactions, 'FlareProof User')

        // Generate XML content
        const xmlContent = generateXML(iso20022)

        // Generate proof hash from the XML content
        const proofHash = keccak256(toBytes(xmlContent))

        // Create proof object
        const proof: Proof = {
          id: iso20022.messageId,
          hash: proofHash,
          transactions,
          iso20022,
          xmlContent,
          createdAt: Date.now(),
          status: 'pending',
          creator: address,
        }

        // Store in local storage for persistence
        storeProofLocally(proof)

        return proof
      } catch (error) {
        console.error('Error generating proof:', error)
        throw new Error('Failed to generate proof. Please try again.')
      }
    },
    onSuccess: () => {
      // Invalidate proofs query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['proofs'] })
    },
  })
}

/**
 * Hook to retrieve stored proofs from local storage
 * @returns Array of stored proofs
 */
export function useStoredProofs() {
  const { address } = useAccount()

  const getProofs = (): Proof[] => {
    if (typeof window === 'undefined' || !address) return []

    try {
      const stored = localStorage.getItem(`proofs_${address}`)
      if (!stored) return []

      const proofs = JSON.parse(stored) as Proof[]
      return proofs.sort((a, b) => b.createdAt - a.createdAt)
    } catch (error) {
      console.error('Error loading stored proofs:', error)
      return []
    }
  }

  return { proofs: getProofs() }
}

/**
 * Store proof in local storage
 * @param proof - Proof to store
 */
function storeProofLocally(proof: Proof) {
  if (typeof window === 'undefined' || !proof.creator) return

  try {
    const key = `proofs_${proof.creator}`
    const existing = localStorage.getItem(key)
    const proofs: Proof[] = existing ? JSON.parse(existing) : []

    // Add new proof at the beginning
    proofs.unshift(proof)

    // Keep only last 100 proofs
    const limited = proofs.slice(0, 100)

    localStorage.setItem(key, JSON.stringify(limited))
  } catch (error) {
    console.error('Error storing proof locally:', error)
  }
}

/**
 * Update stored proof with anchor information
 * @param proofId - ID of proof to update
 * @param anchorTx - Anchor transaction hash
 * @param anchorBlock - Block number of anchor transaction
 */
export function updateProofAnchor(
  proofId: string,
  address: string,
  anchorTx: string,
  anchorBlock: bigint
) {
  if (typeof window === 'undefined') return

  try {
    const key = `proofs_${address}`
    const existing = localStorage.getItem(key)
    if (!existing) return

    const proofs: Proof[] = JSON.parse(existing)
    const proofIndex = proofs.findIndex((p) => p.id === proofId)

    if (proofIndex !== -1) {
      proofs[proofIndex] = {
        ...proofs[proofIndex],
        anchorTx,
        anchorBlock,
        status: 'anchored',
      }

      localStorage.setItem(key, JSON.stringify(proofs))
    }
  } catch (error) {
    console.error('Error updating proof anchor:', error)
  }
}
