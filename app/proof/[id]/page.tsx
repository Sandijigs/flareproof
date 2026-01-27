'use client'

import { useProofById } from '@/hooks/use-anchor-proof'
import { Shield, CheckCircle, XCircle, ExternalLink, Loader2 } from 'lucide-react'
import { formatDate, formatAddress } from '@/lib/utils'
import { EXPLORERS } from '@/lib/constants'
import Link from 'next/link'

/**
 * Public proof verification page
 * This page can be accessed WITHOUT connecting a wallet
 */
export default function ProofVerificationPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const { data: proof, isLoading, error } = useProofById(id)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900 dark:text-white">FlareProof</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500"
          >
            Create Your Proof →
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                Verifying proof on Flare blockchain...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Verification Failed</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Unable to verify this proof. Please check the proof ID and try again.
              </p>
              <code className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded text-sm text-slate-900 dark:text-white">
                {id}
              </code>
            </div>
          )}

          {/* Not Found State */}
          {!isLoading && !error && !proof && (
            <div className="text-center py-12">
              <XCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Proof Not Found</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                This proof has not been anchored on the blockchain yet.
              </p>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg mt-6">
                <p className="text-sm font-semibold mb-2 text-slate-900 dark:text-white">Proof ID:</p>
                <code className="text-xs font-mono text-slate-600 dark:text-slate-400">{id}</code>
              </div>
            </div>
          )}

          {/* Verified State */}
          {!isLoading && !error && proof && proof.exists && (
            <div>
              {/* Verification Badge */}
              <div className="flex items-center justify-center mb-8">
                <div className="bg-green-50 dark:bg-green-950/30 border-2 border-green-500 rounded-full px-6 py-3 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-500" />
                  <span className="font-bold text-green-700 dark:text-green-400">
                    VERIFIED ON FLARE
                  </span>
                </div>
              </div>

              {/* Proof Details */}
              <h1 className="text-3xl font-bold text-center mb-8 text-slate-900 dark:text-white">Payment Proof</h1>

              <div className="space-y-6">
                {/* Proof ID */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Proof ID
                  </p>
                  <p className="font-mono text-lg font-semibold text-slate-900 dark:text-white">{id}</p>
                </div>

                {/* Proof Hash */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Proof Hash
                  </p>
                  <p className="font-mono text-sm break-all text-slate-900 dark:text-white">{proof.proofHash}</p>
                </div>

                {/* Creator */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Created By
                  </p>
                  <p className="font-mono text-slate-900 dark:text-white">{formatAddress(proof.creator, 8)}</p>
                </div>

                {/* Timestamp */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Anchored On
                  </p>
                  <p className="text-slate-900 dark:text-white">{formatDate(proof.timestamp * 1000)}</p>
                </div>

                {/* View on Explorer */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Blockchain Verification
                  </p>
                  <a
                    href={`${EXPLORERS[114]}/address/${process.env.NEXT_PUBLIC_PROOF_ANCHOR_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 flex items-center gap-2"
                  >
                    View Contract on Explorer
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-6">
                  <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">
                    What does this mean?
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        This proof is permanently recorded on Flare blockchain and cannot be
                        altered or deleted
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        The proof hash represents ISO 20022 compliant payment records
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        Anyone can verify this proof at any time using the Proof ID
                      </span>
                    </li>
                  </ul>
                </div>

                {/* CTA */}
                <div className="text-center pt-6">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Create Your Own Proof
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-8">
          Powered by FlareProof - ISO 20022 Payment Proofs on Flare Network
        </p>
      </main>
    </div>
  )
}
