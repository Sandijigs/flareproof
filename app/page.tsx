'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useTransactions, useTransactionStats } from '@/hooks/use-transactions'
import {
  ArrowRight, Shield, FileText, Share2, Download, CheckCircle,
  Sparkles, Lock, Zap, TrendingUp, BarChart3, Wallet, ExternalLink, Filter
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TransactionTable } from '@/components/transaction-table'
import { ProofGenerationModal } from '@/components/proof-generation-modal'
import { ProofList } from '@/components/proof-list'

export default function HomePage() {
  const { isConnected } = useAccount()

  if (isConnected) {
    return <Dashboard />
  }

  return <LandingPage />
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Subtle Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      {/* Header */}
      <header className="relative border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900 dark:text-white">
              FlareProof
            </span>
            <Badge variant="secondary" className="text-xs">Beta</Badge>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-sm mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Enterprise-Grade Financial Documentation • Blockchain-Native</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white">
            Transform Blockchain Transactions into{' '}
            <span className="text-blue-600 dark:text-blue-500">Institutional-Grade Proofs</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            FlareProof converts your Flare Network payments into ISO 20022-compliant financial records, providing cryptographically-secured payment documentation that meets global banking standards.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <Button onClick={openConnectModal} size="lg" className="group">
                  <Wallet className="h-4 w-4 mr-2" />
                  Get Started Free
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </ConnectButton.Custom>

            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com/yourusername/flareproof" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-500 mb-2">100%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Trustless</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-500 mb-2">ISO</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">20022 Certified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-500 mb-2">∞</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Permanent Records</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Enterprise-Ready Payment Verification</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Bridge the gap between blockchain transparency and traditional finance requirements
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="h-6 w-6" />}
            title="ISO 20022 Standard"
            description="Generate pacs.008 compliant payment messages recognized by banks and financial institutions globally, ensuring seamless integration with traditional payment infrastructure."
          />
          <FeatureCard
            icon={<Lock className="h-6 w-6" />}
            title="Cryptographic Verification"
            description="Leverage Flare Network&apos;s immutable ledger to create tamper-proof payment records with cryptographic proof-of-existence that withstands regulatory scrutiny."
          />
          <FeatureCard
            icon={<Share2 className="h-6 w-6" />}
            title="Universal Accessibility"
            description="Share verification links that work for anyone—accountants, auditors, or clients—without requiring crypto wallets or blockchain expertise."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Streamlined Proof Generation</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            From blockchain transaction to regulatory-compliant documentation in minutes
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <StepCard number={1} title="Authenticate" description="Securely connect your Web3 wallet to retrieve transaction history from Flare Network" />
          <StepCard number={2} title="Curate" description="Select specific transactions to consolidate into a single verifiable proof document" />
          <StepCard number={3} title="Certify" description="Generate ISO 20022 pacs.008 message and anchor the cryptographic hash on-chain" />
          <StepCard number={4} title="Distribute" description="Export as PDF/XML for accounting systems or share tamper-proof verification URLs" />
        </div>
      </section>

      {/* CTA */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-600 dark:to-blue-700 p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Modernize Your Payment Documentation</h2>
            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Transform blockchain payments into audit-ready financial records that satisfy both regulators and accountants
            </p>
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <Button
                  onClick={openConnectModal}
                  size="lg"
                  variant="secondary"
                  className="bg-white hover:bg-slate-100 text-blue-600"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Your First Proof
                </Button>
              )}
            </ConnectButton.Custom>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">FlareProof</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-2 max-w-2xl mx-auto">
              Enterprise-grade payment proof infrastructure built on Flare Network.
              Bridging blockchain transparency with traditional finance compliance standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Technology</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>ISO 20022 Compliance</li>
                <li>Flare Network</li>
                <li>Cryptographic Hashing</li>
                <li>Smart Contract Anchoring</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Standards</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>pacs.008.001.08</li>
                <li>XML Schema Validation</li>
                <li>EVM-Compatible</li>
                <li>Open Source</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Use Cases</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>Audit Documentation</li>
                <li>Regulatory Compliance</li>
                <li>Financial Reporting</li>
                <li>Dispute Resolution</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Powered by Flare Network
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-600 mt-2">
              © 2026 FlareProof. No wallet data is stored on our servers. All proofs are anchored on-chain.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Dashboard() {
  const { address } = useAccount()
  const { data: transactions, isLoading } = useTransactions()
  const stats = useTransactionStats()

  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [isProofModalOpen, setIsProofModalOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all')
  const [activeTab, setActiveTab] = useState<'transactions' | 'proofs'>('transactions')

  const filteredTransactions = transactions?.filter(tx => {
    if (filter === 'all') return true
    if (filter === 'sent') return tx.from.toLowerCase() === address?.toLowerCase()
    if (filter === 'received') return tx.to.toLowerCase() === address?.toLowerCase()
    return true
  })

  const selectedTxObjects = transactions?.filter(tx =>
    selectedTransactions.includes(tx.hash)
  ) || []

  const handleGenerateProof = () => {
    if (selectedTransactions.length === 0) return
    setIsProofModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900 dark:text-white">FlareProof</span>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            label="Total Transactions"
            value={stats.totalTransactions.toString()}
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <StatsCard
            label="Total Sent"
            value={`${stats.totalSent} FLR`}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatsCard
            label="Total Received"
            value={`${stats.totalReceived} FLR`}
            icon={<Download className="h-5 w-5" />}
          />
          <StatsCard
            label="Success Rate"
            value={`${stats.successRate}%`}
            icon={<CheckCircle className="h-5 w-5" />}
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'transactions' ? 'default' : 'outline'}
            onClick={() => setActiveTab('transactions')}
            className="flex-1 sm:flex-none"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Transactions
          </Button>
          <Button
            variant={activeTab === 'proofs' ? 'default' : 'outline'}
            onClick={() => setActiveTab('proofs')}
            className="flex-1 sm:flex-none"
          >
            <FileText className="h-4 w-4 mr-2" />
            My Proofs
          </Button>
        </div>

        {/* Transactions Section */}
        {activeTab === 'transactions' && (
          <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Your Transactions</CardTitle>
                <CardDescription className="mt-2">
                  Select transactions to generate ISO 20022 proof
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilter('all')}
                  className={filter === 'all' ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700' : ''}
                >
                  All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilter('sent')}
                  className={filter === 'sent' ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700' : ''}
                >
                  Sent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilter('received')}
                  className={filter === 'received' ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700' : ''}
                >
                  Received
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Loading transactions...</p>
              </div>
            )}

            {!isLoading && transactions && transactions.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">No transactions found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Make some transactions on Flare to get started
                </p>
                <Button variant="outline" asChild>
                  <a href="https://faucet.flare.network/coston2" target="_blank" rel="noopener noreferrer">
                    Get Testnet Tokens
                  </a>
                </Button>
              </div>
            )}

            {!isLoading && filteredTransactions && filteredTransactions.length > 0 && (
              <div className="space-y-4">
                {/* Selection Info Bar */}
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                    <p className="font-medium text-slate-900 dark:text-white">
                      {selectedTransactions.length > 0
                        ? `${selectedTransactions.length} transaction${selectedTransactions.length !== 1 ? 's' : ''} selected`
                        : `${filteredTransactions.length} transaction${filteredTransactions.length !== 1 ? 's' : ''} available`
                      }
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerateProof}
                    disabled={selectedTransactions.length === 0}
                    size="sm"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Proof
                  </Button>
                </div>

                {/* Transaction Table */}
                <TransactionTable
                  transactions={filteredTransactions}
                  selectedTransactions={selectedTransactions}
                  onSelectionChange={setSelectedTransactions}
                  userAddress={address}
                />
              </div>
            )}
          </CardContent>
        </Card>
        )}

        {/* Proofs Section */}
        {activeTab === 'proofs' && (
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                My Payment Proofs
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                View and manage your generated ISO 20022 payment proofs
              </p>
            </div>
            <ProofList />
          </div>
        )}
      </div>

      {/* Proof Generation Modal */}
      <ProofGenerationModal
        open={isProofModalOpen}
        onOpenChange={setIsProofModalOpen}
        selectedTransactions={selectedTxObjects}
        onComplete={() => {
          setSelectedTransactions([])
        }}
      />
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-500 mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

function StepCard({
  number,
  title,
  description
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <Card className="text-center border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="w-14 h-14 bg-blue-600 text-white rounded-lg flex items-center justify-center text-2xl font-bold mx-auto mb-4">
          {number}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </CardContent>
    </Card>
  )
}

function StatsCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
          <div className="text-blue-600 dark:text-blue-500">{icon}</div>
        </div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      </CardContent>
    </Card>
  )
}
