'use client'

import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/wagmi-config'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'

/**
 * Root providers component that wraps the entire application
 * Includes Wagmi, RainbowKit, React Query, and Theme providers
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 3,
            staleTime: 30000,
          },
        },
      })
  )

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RainbowKitProvider
            theme={{
              lightMode: lightTheme({
                accentColor: '#3B82F6',
                accentColorForeground: 'white',
                borderRadius: 'medium',
                fontStack: 'system',
              }),
              darkMode: darkTheme({
                accentColor: '#3B82F6',
                accentColorForeground: 'white',
                borderRadius: 'medium',
                fontStack: 'system',
              }),
            }}
            modalSize="compact"
          >
            {children}
          </RainbowKitProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
