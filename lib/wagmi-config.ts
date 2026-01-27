'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { flare, coston2 } from './chains'

// Ensure WalletConnect project ID is available
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  console.warn(
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined. Get one at https://cloud.walletconnect.com'
  )
}

export const config = getDefaultConfig({
  appName: 'FlareProof',
  projectId: projectId || 'flareproof-default-project-id',
  chains: [coston2, flare], // Testnet first for development
  transports: {
    [flare.id]: http('https://flare-api.flare.network/ext/C/rpc'),
    [coston2.id]: http('https://coston2-api.flare.network/ext/C/rpc'),
  },
  ssr: true,
})
