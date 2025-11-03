import { alchemyTokenBalances, alchemyTokenInfo } from '@/common/evm/alchemyTokenQueries';
import { Account } from '@/models/Account';
import { Token } from '@/models/Token';
import { TokenBalance } from '@/models/TokenBalance';
import { AppDataSource } from '@/server';

export interface BalanceQueryParams {
  address: string;
  chainId: number;
}

export async function balanceQuery({ address, chainId }: BalanceQueryParams) {
  const alchemyTokens = await alchemyTokenBalances(chainId, address as `0x${string}`);
  if (!alchemyTokens) {
    throw new Error('Failed to fetch token balances'); // TODO error handling
  }
  const tokenBalances = alchemyTokens.tokenBalances.filter((tb) => tb.tokenBalance != BigInt(0));

  const tokenInfo = await alchemyTokenInfo(chainId, tokenBalances.map((tb) => tb.contractAddress));
  // We update token info in database
  const tokenInfoRepository = AppDataSource.getRepository(Token);
  const tokenBalanceRepository = AppDataSource.getRepository(TokenBalance);
  const accountRepository = AppDataSource.getRepository(Account);

  // We include the new token metadata inside the database
  const updateResult = await tokenInfoRepository.upsert(
    tokenInfo.map((info) => {
      return {
        contractAddress: info.contractAddress,
        chainId: chainId,
        decimals: info.decimals ?? 0,
        logo: info.logo,
        name: info.name,
        symbol: info.symbol,
      } as Token;
    }),
    ['chainId', 'contractAddress']
  );

  const savedTokenInfo = tokenInfo.map((info, index) => {
    return {
      id: updateResult.identifiers[index].id,
      ...info,
    };
  });

  const user = await accountRepository.findOneBy({ address: address as `0x${string}` });
  if (!user) {
    throw new Error('User not found'); // TODO error handling
  }

  // We update token balances in database
  tokenBalanceRepository.upsert(
    tokenBalances.map((tb) => {
      const info = savedTokenInfo.find((ti) => ti.contractAddress === tb.contractAddress)!;
      return {
        user: { id: user.id },
        token: { id: info.id },
        userBalance: tb.tokenBalance.toString(),
      };
    }),
    ['user.id', 'token.id']
  );

  const returnStruct = tokenBalances.map((tb, index) => {
    const info = tokenInfo.find((ti) => ti.contractAddress === tb.contractAddress)!;
    return {
      contractAddress: tb.contractAddress,
      tokenBalance: tb.tokenBalance.toString(),
      decimals: info.decimals,
      logo: info.logo,
      name: info.name,
      symbol: info.symbol,
    };
  });

  return returnStruct;
}
