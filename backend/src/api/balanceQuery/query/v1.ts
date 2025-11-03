import { BalanceQuerySchemaMessage, BalanceQuerySchemaVersion } from '../balanceQuerySchema';
import { publicClient } from '@/common/evm/viemClient';
import { alchemyTokenBalances, alchemyTokenInfo } from '@/common/evm/alchemyTokenQueries';

export interface BalanceQueryV1Params {
    address: string;
    signature: string;
}

export async function balanceQueryV1({ address, signature }: BalanceQueryV1Params) {
    const valid = await publicClient.verifyMessage({
        address: address as `0x${string}`,
        message: BalanceQuerySchemaMessage[BalanceQuerySchemaVersion.V1](address),
        signature: signature as `0x${string}`,
    })
    if (!valid) {
        throw new Error('Invalid signature'); // TODO custom error
    }

    const alchemyTokens = await alchemyTokenBalances(address as `0x${string}`);
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