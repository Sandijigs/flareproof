import { defineChain } from 'viem'

export const flare = defineChain({
  id: 14,
  name: 'Flare',
  nativeCurrency: { name: 'Flare', symbol: 'FLR', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://flare-api.flare.network/ext/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Flare Explorer', url: 'https://flare-explorer.flare.network' },
  },
  contracts: {
    ensRegistry: undefined,
    ensUniversalResolver: undefined,
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 0,
    },
  },
})

export const coston2 = defineChain({
  id: 114,
  name: 'Coston2',
  nativeCurrency: { name: 'Coston2 Flare', symbol: 'C2FLR', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://coston2-api.flare.network/ext/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Coston2 Explorer', url: 'https://coston2-explorer.flare.network' },
  },
  contracts: {
    ensRegistry: undefined,
    ensUniversalResolver: undefined,
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 0,
    },
  },
  testnet: true,
})
