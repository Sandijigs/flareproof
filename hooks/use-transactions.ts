'use client'

import { useQuery } from '@tanstack/react-query'
import { useAccount, usePublicClient } from 'wagmi'
import { formatEther } from 'viem'
import { Transaction } from '@/types/transaction'
import { CACHE_TIME, EXPLORER_APIS, ITEMS_PER_PAGE } from '@/lib/constants'

/**
 * Hook to fetch and manage user transactions from Flare blockchain
 * @returns Query result with transactions array and loading states
 */
export function useTransactions() {
  const { address, chain } = useAccount()
  const publicClient = usePublicClient()

  return useQuery({
    queryKey: ['transactions', address, chain?.id],
    queryFn: async (): Promise<Transaction[]> => {
      if (!address || !publicClient || !chain?.id) return []

      // Get explorer API URL based on chain
      const explorerUrl = EXPLORER_APIS[chain.id as keyof typeof EXPLORER_APIS]

      if (!explorerUrl) {
        console.warn(`No explorer API configured for chain ${chain.id}`)
        return []
      }

      try {
        // Fetch transactions from Blockscout API
        const response = await fetch(
          `${explorerUrl}?module=account&action=txlist&address=${address}&sort=desc&page=1&offset=${ITEMS_PER_PAGE}`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch transactions: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.status !== '1' || !data.result) {
          console.warn('No transactions found or API error:', data.message)
          return []
        }

        // Transform API response to Transaction type
        const transactions: Transaction[] = data.result.map((tx: any) => {
          const valueInWei = BigInt(tx.value || '0')
          const valueFormatted = formatEther(valueInWei)

          return {
            hash: tx.hash,
            from: tx.from,
            to: tx.to || '',
            value: valueInWei.toString(),
            valueFormatted,
            timestamp: parseInt(tx.timeStamp) * 1000, // Convert to milliseconds
            blockNumber: BigInt(tx.blockNumber),
            status: tx.isError === '0' ? 'success' : 'failed',
            type: tx.from.toLowerCase() === address.toLowerCase() ? 'send' : 'receive',
            gasUsed: tx.gasUsed ? BigInt(tx.gasUsed) : undefined,
            gasPrice: tx.gasPrice ? BigInt(tx.gasPrice) : undefined,
            input: tx.input,
            nonce: tx.nonce ? parseInt(tx.nonce) : undefined,
          } as Transaction
        })

        return transactions
      } catch (error) {
        console.error('Error fetching transactions:', error)
        throw error
      }
    },
    enabled: !!address && !!publicClient && !!chain?.id,
    refetchInterval: CACHE_TIME.TRANSACTIONS,
    staleTime: CACHE_TIME.TRANSACTIONS / 2,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Hook to get transaction statistics
 * @returns Computed stats from transactions
 */
export function useTransactionStats() {
  const { data: transactions } = useTransactions()

  if (!transactions || transactions.length === 0) {
    return {
      totalTransactions: 0,
      totalSent: '0',
      totalReceived: '0',
      successRate: 0,
      averageGasPrice: '0',
    }
  }

  const sentTxs = transactions.filter((tx) => tx.type === 'send')
  const receivedTxs = transactions.filter((tx) => tx.type === 'receive')
  const successfulTxs = transactions.filter((tx) => tx.status === 'success')

  const totalSent = sentTxs.reduce(
    (sum, tx) => sum + parseFloat(tx.valueFormatted),
    0
  )

  const totalReceived = receivedTxs.reduce(
    (sum, tx) => sum + parseFloat(tx.valueFormatted),
    0
  )

  const successRate = (successfulTxs.length / transactions.length) * 100

  const avgGasPrice =
    transactions
      .filter((tx) => tx.gasPrice)
      .reduce((sum, tx) => sum + Number(tx.gasPrice), 0) /
    transactions.filter((tx) => tx.gasPrice).length

  return {
    totalTransactions: transactions.length,
    totalSent: totalSent.toFixed(4),
    totalReceived: totalReceived.toFixed(4),
    successRate: successRate.toFixed(2),
    averageGasPrice: formatEther(BigInt(Math.floor(avgGasPrice || 0))),
  }
}
