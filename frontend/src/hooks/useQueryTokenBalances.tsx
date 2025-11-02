
import { alchemyTokenBalances, alchemyTokenInfo, TokenBalances } from '@/queries/alchemyTokenBalance';
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
            const alchemyTokens: TokenBalances = await alchemyTokenBalances(address);

            const tokenInfo = await alchemyTokenInfo(alchemyTokens.tokenBalances.map(tb => tb.contractAddress));

            const returnStruct = alchemyTokens.tokenBalances.map((tb, index) => {
                const info = tokenInfo.find(ti => ti.contractAddress === tb.contractAddress)!;
                return {
                    contractAddress: tb.contractAddress,
                    tokenBalance: tb.tokenBalance,
                    decimals: info.decimals,
                    logo: info.logo,
                    name: info.name,
                    symbol: info.symbol,
                };
            });

            return returnStruct
        },
    });
}