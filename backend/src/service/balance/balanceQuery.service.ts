import { alchemyTokenBalances, alchemyTokenInfo } from '@/common/evm/alchemyTokenQueries';
import { AppDataSource } from '@/common/middleware/dataSource';
import { Account } from '@/models/Account.model';
import { Token } from '@/models/Token.model';
import { TokenBalance } from '@/models/TokenBalance.model';
import { In } from 'typeorm';

export interface BalanceQueryParams {
  address: string;
  chainId: number;
}

export async function balanceQuery({ address, chainId }: BalanceQueryParams) {
  // Fetching the token balances
  const alchemyTokens = await alchemyTokenBalances(chainId, address as `0x${string}`);
  if (!alchemyTokens) {
    throw new Error('Failed to fetch token balances'); // TODO error handling
  }
  const tokenBalances = alchemyTokens.tokenBalances.filter((tb) => tb.tokenBalance != BigInt(0));

  // Associating the Token Info
  const tokenInfo = await getOrFetchTokenInfo(
    chainId,
    tokenBalances.map((tb) => tb.contractAddress)
  );

  // We update token info in database
  const tokenBalanceRepository = AppDataSource.getRepository(TokenBalance);
  const accountRepository = AppDataSource.getRepository(Account);

  const user = await accountRepository.findOneBy({ address: address as `0x${string}`, chainId });
  if (!user) {
    throw new Error('User not found'); // TODO error handling
  }

  // We update token balances in database
  tokenBalanceRepository.upsert(
    tokenBalances.map((tb) => {
      const info = tokenInfo.find((ti) => ti.contractAddress === tb.contractAddress)!;
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

export async function getOrFetchTokenInfo(chainId: number, contractAddresses: `0x${string}`[]) {
  const tokenInfoRepository = AppDataSource.getRepository(Token);
  const tokens = await tokenInfoRepository.find({
    where: {
      chainId: chainId,
      contractAddress: In(contractAddresses),
    },
  });

  const tokenNotFound = contractAddresses.filter((ca) => !tokens.find((t) => t.contractAddress === ca));

  const newMetadata = await alchemyTokenInfo(chainId, tokenNotFound);
  const newMetadataToInsert = newMetadata.map((info) => {
    return {
      contractAddress: info.contractAddress,
      chainId: chainId,
      decimals: info.decimals ?? 0,
      logo: info.logo,
      name: info.name,
      symbol: info.symbol,
    } as Token;
  });
  const updateResult = await tokenInfoRepository.upsert(newMetadataToInsert, ['chainId', 'contractAddress']);

  const allTokenInfo = [
    ...tokens,
    ...newMetadataToInsert.map((info, index) => {
      return {
        id: updateResult.identifiers[index].id,
        ...info,
      };
    }),
  ];
  return allTokenInfo;
}

export async function getAllBalances() {
  const accountRepository = AppDataSource.getRepository(Account);

  return await accountRepository.find({
    relations: {
      balances: {
        token: true,
      },
    },
  });
}
