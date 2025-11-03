
import { backendTokenBalances } from '@/queries/backenTokenBalance';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export interface TokenBalanceWithInfo {
    contractAddress: `0x${string}`;
    tokenBalance: bigint;
    decimals: number;
    logo: null;
    name: string;
    symbol: string;
}

export function useQueryTokenBalances() {
    const { address } = useAccount();

    return useQuery<TokenBalanceWithInfo[]>({
        enabled: !!address,
        queryKey: ['tokenBalances', address],
        queryFn: async () => {
            if (!address) {
                throw new Error("Unreachable, no account connected");
            }
            const backendTokens = await backendTokenBalances(address);
            return backendTokens.responseObject;
        },
    });
}