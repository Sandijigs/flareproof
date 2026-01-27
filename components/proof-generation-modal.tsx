'use client'

import { useState } from 'react'
import { Transaction } from '@/types/transaction'
import { useProofGenerator } from '@/hooks/use-proof-generator'
import { useAnchorProof } from '@/hooks/use-anchor-proof'
import { generatePDF } from '@/lib/pdf-generator'
import { generateXML } from '@/lib/iso20022'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Download,
  Shield,
  CheckCircle,
  Loader2,
  Link as LinkIcon,
  FileCode,
  Share2,
} from 'lucide-react'
import { copyToClipboard, generateProofUrl } from '@/lib/utils'

interface ProofGenerationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTransactions: Transaction[]
  onComplete?: () => void
}

type Step = 'generate' | 'anchor' | 'complete'

export function ProofGenerationModal({
  open,
  onOpenChange,
  selectedTransactions,
  onComplete,
}: ProofGenerationModalProps) {
  const [step, setStep] = useState<Step>('generate')
  const [proofId, setProofId] = useState<string | null>(null)
  const [proofHash, setProofHash] = useState<string | null>(null)
  const [currentProof, setCurrentProof] = useState<any>(null)

  const { mutateAsync: generateProof, isPending: isGenerating } = useProofGenerator()
  const anchorMutation = useAnchorProof()
  const { mutateAsync: anchorProof, isPending: isAnchoring, isSuccess } = anchorMutation

  const handleGenerateProof = async () => {
    try {
      const proof = await generateProof(selectedTransactions)
      setProofId(proof.id)
      setProofHash(proof.hash)
      setCurrentProof(proof)
      setStep('anchor')
    } catch (error) {
      console.error('Failed to generate proof:', error)
      alert(`Error generating proof: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleAnchorProof = async () => {
    if (!proofId || !proofHash) return

    try {
      await anchorProof({ proofHash: proofHash as `0x${string}`, proofId })
      setStep('complete')
    } catch (error) {
      console.error('Failed to anchor proof:', error)
      alert(`Error anchoring proof: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDownloadPDF = async () => {
    if (!currentProof) {
      alert('Proof data not available')
      return
    }

    try {
      await generatePDF(currentProof)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      alert(`Error downloading PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDownloadXML = () => {
    if (!currentProof) {
      alert('Proof data not available')
      return
    }

    try {
      const xml = generateXML(currentProof.iso20022)

      const blob = new Blob([xml], { type: 'application/xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `proof-${proofId}.xml`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download XML:', error)
      alert(`Error downloading XML: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleCopyLink = () => {
    if (!proofId) return

    try {
      const url = generateProofUrl(proofId)
      copyToClipboard(url)
      alert('Verification link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
      alert('Failed to copy link')
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setStep('generate')
      setProofId(null)
      onComplete?.()
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Generate Payment Proof</DialogTitle>
          <DialogDescription>
            Create an ISO 20022-compliant proof for {selectedTransactions.length} transaction
            {selectedTransactions.length !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Generate Proof */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step === 'generate'
                    ? 'bg-blue-600 text-white'
                    : proofId
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {proofId ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Generate ISO 20022 Proof
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Create compliant payment proof document
                </p>
              </div>
              {step === 'generate' && (
                <Button
                  onClick={handleGenerateProof}
                  disabled={isGenerating}
                  size="sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate'
                  )}
                </Button>
              )}
            </div>

            {proofId && (
              <div className="ml-11 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Proof ID
                    </p>
                    <code className="text-sm font-mono text-slate-900 dark:text-white">
                      {proofId}
                    </code>
                  </div>
                  <Badge className="bg-green-500">Generated</Badge>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Anchor to Blockchain */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step === 'anchor'
                    ? 'bg-blue-600 text-white'
                    : step === 'complete'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {step === 'complete' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Anchor to Blockchain
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Immutably store proof on Flare Network
                </p>
              </div>
              {step === 'anchor' && (
                <Button
                  onClick={handleAnchorProof}
                  disabled={isAnchoring || !proofId}
                  size="sm"
                >
                  {isAnchoring ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Anchoring...
                    </>
                  ) : (
                    'Anchor'
                  )}
                </Button>
              )}
            </div>

            {isSuccess && (
              <div className="ml-11 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                <p className="text-sm text-green-800 dark:text-green-400">
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                  Successfully anchored to Flare blockchain
                </p>
              </div>
            )}
          </div>

          {/* Step 3: Download & Share */}
          {step === 'complete' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Share2 className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Download & Share
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Export or share your proof
                  </p>
                </div>
              </div>

              <div className="ml-11 space-y-2">
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  onClick={handleDownloadXML}
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <FileCode className="h-4 w-4 mr-2" />
                  Download XML
                </Button>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Copy Verification Link
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {step === 'complete' ? 'Done' : 'Cancel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
