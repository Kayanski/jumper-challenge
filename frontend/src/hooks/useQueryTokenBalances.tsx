
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

export function useQueryTokenBalances({ signature }: { signature: `0x${string}` | null }) {
    const { address } = useAccount();

    return useQuery<TokenBalanceWithInfo[]>({
        enabled: !!address && !!signature,
        queryKey: ['tokenBalances', address],
        queryFn: async () => {
            if (!address) {
                throw new Error("Unreachable, no account connected");
            }
            if (!signature) {
                throw new Error("Unreachable, ownership message not signed");
            }
            const backendTokens = await backendTokenBalances(address, signature);
            return backendTokens.responseObject;
        },
    });
}