'use client';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base, avalanche } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { InitColorSchemeScript } from '@mui/material';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const config = getDefaultConfig({
  appName: 'Token Explorer App',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [mainnet, polygon, optimism, arbitrum, base, avalanche],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
export const queryClient = new QueryClient();

export function ContextProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <InitColorSchemeScript attribute="class" />
          {children}
        </RainbowKitProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
