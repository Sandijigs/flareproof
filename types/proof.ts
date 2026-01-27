/**
 * Proof type definitions
 */

import { Transaction } from './transaction'
import { ISO20022Message } from './iso20022'

export type ProofStatus = 'pending' | 'anchored' | 'verified'

export interface Proof {
  id: string
  hash: string
  anchorTx?: string
  anchorBlock?: bigint
  transactions: Transaction[]
  iso20022: ISO20022Message
  xmlContent: string
  createdAt: number
  status: ProofStatus
  creator?: string
}

export interface ProofRecord {
  proofHash: string
  creator: string
  timestamp: number
  proofId: string
}

export interface VerificationResult {
  exists: boolean
  creator: string
  timestamp: number
  proofId: string
  isValid: boolean
}
