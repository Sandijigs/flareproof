'use client'

import { useEffect, useState } from 'react'
import { Proof } from '@/types/proof'
import { formatDate, formatAddress, copyToClipboard, generateProofUrl } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Download,
  Share2,
  ExternalLink,
  Calendar,
  Hash,
  CheckCircle,
  Link as LinkIcon,
  FileCode,
  Trash2,
} from 'lucide-react'
import { generatePDF } from '@/lib/pdf-generator'
import { generateXML } from '@/lib/iso20022'

export function ProofList() {
  const [proofs, setProofs] = useState<Proof[]>([])

  useEffect(() => {
    loadProofs()
  }, [])

  const loadProofs = () => {
    const allProofs: Proof[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('proof_')) {
        try {
          const proof = JSON.parse(localStorage.getItem(key) || '{}')
          allProofs.push(proof)
        } catch (error) {
          console.error('Failed to parse proof:', error)
        }
      }
    }
    // Sort by creation date (newest first)
    allProofs.sort((a, b) => b.createdAt - a.createdAt)
    setProofs(allProofs)
  }

  const handleDownloadPDF = async (proof: Proof) => {
    try {
      await generatePDF(proof)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
    }
  }

  const handleDownloadXML = (proof: Proof) => {
    try {
      const xml = generateXML(proof.iso20022)
      const blob = new Blob([xml], { type: 'application/xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `proof-${proof.id}.xml`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download XML:', error)
    }
  }

  const handleCopyLink = (proofId: string) => {
    const url = generateProofUrl(proofId)
    copyToClipboard(url)
  }

  const handleDeleteProof = (proofId: string) => {
    if (confirm('Are you sure you want to delete this proof?')) {
      localStorage.removeItem(`proof_${proofId}`)
      loadProofs()
    }
  }

  if (proofs.length === 0) {
    return (
      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="py-12">
          <div className="text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">
              No proofs generated yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Select transactions and generate your first proof
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {proofs.map((proof) => (
        <Card
          key={proof.id}
          className="border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Payment Proof</CardTitle>
                  <Badge
                    variant={proof.status === 'anchored' ? 'success' : 'secondary'}
                    className="capitalize"
                  >
                    {proof.status}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2 font-mono text-xs">
                  <Hash className="h-3 w-3" />
                  {proof.id}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteProof(proof.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Proof Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Transactions</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {proof.transactions.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Amount</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {proof.transactions.reduce((sum, tx) => sum + parseFloat(tx.valueFormatted), 0).toFixed(4)} FLR
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Created</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {formatDate(proof.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Hash</p>
                <p className="font-semibold font-mono text-xs text-slate-900 dark:text-white">
                  {formatAddress(proof.hash)}
                </p>
              </div>
            </div>

            {/* Transaction List Preview */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Included Transactions
              </p>
              <div className="space-y-1">
                {proof.transactions.slice(0, 3).map((tx) => (
                  <div
                    key={tx.hash}
                    className="flex items-center justify-between p-2 bg-white dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 text-sm"
                  >
                    <code className="text-xs font-mono text-slate-600 dark:text-slate-400">
                      {formatAddress(tx.hash)}
                    </code>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {parseFloat(tx.valueFormatted).toFixed(4)} FLR
                    </span>
                  </div>
                ))}
                {proof.transactions.length > 3 && (
                  <p className="text-xs text-slate-500 dark:text-slate-500 pl-2">
                    +{proof.transactions.length - 3} more transaction{proof.transactions.length - 3 !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadPDF(proof)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadXML(proof)}
              >
                <FileCode className="h-4 w-4 mr-2" />
                Download XML
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyLink(proof.id)}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a
                  href={`/proof/${proof.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Proof
                </a>
              </Button>
            </div>

            {/* Verification Status */}
            {proof.status === 'anchored' && (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
                <p className="text-sm text-green-800 dark:text-green-400">
                  Anchored on Flare blockchain
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
