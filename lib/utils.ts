import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format blockchain address to shortened version
 * @param address - The full blockchain address
 * @param chars - Number of characters to show on each side (default: 4)
 * @returns Formatted address like "0x1234...5678"
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return ''
  if (address.length <= chars * 2 + 2) return address
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/**
 * Format amount with proper decimals and localization
 * @param amount - The amount as string
 * @param decimals - Maximum decimal places (default: 4)
 * @returns Formatted amount with commas and decimals
 */
export function formatAmount(amount: string, decimals = 4): string {
  const num = parseFloat(amount)
  if (isNaN(num)) return '0'
  if (num === 0) return '0'
  if (num < 0.0001) return '< 0.0001'
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

/**
 * Format timestamp to human-readable date
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Generate unique proof ID with date-based format
 * @returns Proof ID in format "FP-YYYY-MMDD-XXXX"
 */
export function generateProofId(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `FP-${year}-${month}${day}-${random}`
}

/**
 * Format large numbers with suffixes (K, M, B)
 * @param num - The number to format
 * @returns Formatted number with suffix
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise<boolean> - True if successful
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

/**
 * Generate shareable proof URL
 * @param proofId - The proof ID
 * @returns Full URL to the proof verification page
 */
export function generateProofUrl(proofId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/proof/${proofId}`
}
