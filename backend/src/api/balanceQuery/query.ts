import { alchemyTokenBalances, alchemyTokenInfo } from '@/common/evm/alchemyTokenQueries';

export interface BalanceQueryParams {
    address: string;
}

export async function balanceQuery({ address }: BalanceQueryParams) {


    const alchemyTokens = await alchemyTokenBalances(address as `0x${string}`);
    if (!alchemyTokens) {
        throw new Error('Failed to fetch token balances'); // TODO error handling
    }
    const tokenBalances = alchemyTokens.tokenBalances.filter(tb => tb.tokenBalance != BigInt(0));

    const tokenInfo = await alchemyTokenInfo(tokenBalances.map(tb => tb.contractAddress));

    const returnStruct = tokenBalances.map((tb, index) => {
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
}