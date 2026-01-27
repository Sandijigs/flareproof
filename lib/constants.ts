/**
 * Application-wide constants
 */

export const APP_NAME = 'FlareProof'
export const APP_DESCRIPTION = 'ISO 20022-compliant payment proof generator for Flare blockchain'

// Transaction types
export const TRANSACTION_TYPES = {
  SEND: 'send',
  RECEIVE: 'receive',
  CONTRACT: 'contract',
} as const

// Transaction statuses
export const TRANSACTION_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  PENDING: 'pending',
} as const

// Proof statuses
export const PROOF_STATUS = {
  PENDING: 'pending',
  ANCHORED: 'anchored',
  VERIFIED: 'verified',
} as const

// ISO 20022 Message Types
export const ISO_MESSAGE_TYPES = {
  PACS_008: 'pacs.008.001.08', // Customer Credit Transfer
} as const

// Payment Methods (ISO 20022)
export const PAYMENT_METHODS = {
  TRANSFER: 'TRF',
} as const

// Blockchain scheme names for ISO 20022
export const SCHEME_NAMES = {
  FLARE_ADDRESS: 'FLARE_ADDRESS',
  BLOCKCHAIN_NETWORK: 'BLOCKCHAIN_NETWORK',
} as const

// Query cache times (in milliseconds)
export const CACHE_TIME = {
  TRANSACTIONS: 30000, // 30 seconds
  PROOF: 60000, // 1 minute
  BALANCE: 15000, // 15 seconds
} as const

// Pagination
export const ITEMS_PER_PAGE = 50

// Transaction limits
export const MAX_TRANSACTIONS_PER_PROOF = 100
export const MIN_TRANSACTIONS_PER_PROOF = 1

// Network explorers
export const EXPLORERS = {
  14: 'https://flare-explorer.flare.network',
  114: 'https://coston2-explorer.flare.network',
} as const

// API endpoints for block explorers
export const EXPLORER_APIS = {
  14: 'https://flare-explorer.flare.network/api',
  114: 'https://coston2-explorer.flare.network/api',
} as const
