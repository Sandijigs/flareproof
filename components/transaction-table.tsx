'use client'

import { useState } from 'react'
import { Transaction } from '@/types/transaction'
import { formatAddress, formatDate } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

interface TransactionTableProps {
  transactions: Transaction[]
  selectedTransactions: string[]
  onSelectionChange: (txHashes: string[]) => void
  userAddress?: string
}

export function TransactionTable({
  transactions,
  selectedTransactions,
  onSelectionChange,
  userAddress
}: TransactionTableProps) {
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      onSelectionChange(transactions.map(tx => tx.hash))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectTransaction = (txHash: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedTransactions, txHash])
    } else {
      onSelectionChange(selectedTransactions.filter(hash => hash !== txHash))
      setSelectAll(false)
    }
  }

  const getTransactionDirection = (tx: Transaction) => {
    if (!userAddress) return 'unknown'
    return tx.from.toLowerCase() === userAddress.toLowerCase() ? 'sent' : 'received'
  }

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectAll}
                onCheckedChange={handleSelectAll}
                aria-label="Select all transactions"
              />
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Transaction Hash</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => {
            const direction = getTransactionDirection(tx)
            const isSelected = selectedTransactions.includes(tx.hash)

            return (
              <TableRow key={tx.hash} data-state={isSelected ? 'selected' : undefined}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      handleSelectTransaction(tx.hash, checked as boolean)
                    }
                    aria-label={`Select transaction ${tx.hash}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {direction === 'sent' ? (
                      <div className="p-1.5 bg-orange-100 dark:bg-orange-950 rounded-full">
                        <ArrowUpRight className="h-3.5 w-3.5 text-orange-600 dark:text-orange-500" />
                      </div>
                    ) : (
                      <div className="p-1.5 bg-green-100 dark:bg-green-950 rounded-full">
                        <ArrowDownLeft className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
                      </div>
                    )}
                    <span className="text-sm font-medium capitalize text-slate-900 dark:text-white">
                      {direction}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs font-mono text-slate-600 dark:text-slate-400">
                    {formatAddress(tx.hash)}
                  </code>
                </TableCell>
                <TableCell>
                  <code className="text-xs font-mono text-slate-600 dark:text-slate-400">
                    {formatAddress(tx.from)}
                  </code>
                </TableCell>
                <TableCell>
                  <code className="text-xs font-mono text-slate-600 dark:text-slate-400">
                    {formatAddress(tx.to)}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {parseFloat(tx.valueFormatted).toFixed(4)} FLR
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {formatDate(tx.timestamp)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={tx.status === 'success' ? 'success' : 'destructive'}
                    className="capitalize"
                  >
                    {tx.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0"
                  >
                    <a
                      href={`https://flare-explorer.flare.network/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View on block explorer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
