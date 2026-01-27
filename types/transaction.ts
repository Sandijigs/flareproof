/**
 * Transaction type definitions
 */

export type TransactionType = 'send' | 'receive' | 'contract'
export type TransactionStatus = 'success' | 'failed' | 'pending'

export interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  valueFormatted: string
  timestamp: number
  blockNumber: bigint
  status: TransactionStatus
  type: TransactionType
  gasUsed?: bigint
  gasPrice?: bigint
  input?: string
  nonce?: number
}

export interface TransactionFilters {
  type?: TransactionType
  status?: TransactionStatus
  startDate?: number
  endDate?: number
  minAmount?: string
  maxAmount?: string
}

export interface TransactionStats {
  totalTransactions: number
  totalSent: string
  totalReceived: string
  successRate: number
  averageGasPrice: string
}
