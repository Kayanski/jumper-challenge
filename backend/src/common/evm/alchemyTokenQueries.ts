import { env } from '@/common/utils/envConfig';
import { getAlchemyEndpoint } from './alchemyEnpoint';

const apiKey = env.ALCHEMY_API_KEY;

function baseUrl(chainId: number): URL {
  const alchemyEndpoint = getAlchemyEndpoint(chainId);
  return new URL(`/v2/${apiKey}`, alchemyEndpoint);
}

export enum AlchemyErrorType {
  None,
  TokenInfo,
  TokenBalance
}

export class AlchemyQueryError extends Error {
  type: AlchemyErrorType;
  constructor(message: string, type?: AlchemyErrorType) {
    super(message);
    this.name = 'AlchemyQueryError';
    this.type = type ?? AlchemyErrorType.None;
  }
}

export interface TokenBalance {
  contractAddress: `0x${string}`;
  tokenBalance: bigint;
}

export interface TokenBalances {
  address: `0x${string}`;
  tokenBalances: TokenBalance[];
}

export async function alchemyTokenBalances(chainId: number, address: `0x${string}`): Promise<TokenBalances> {
  // Get token balances
  try {
    const response = await fetch(baseUrl(chainId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getTokenBalances',
        params: [address],
        id: 1,
      }),
    });
    const jsonResponse = await response.json();
    return jsonResponse.result;

  } catch (error) {
    throw new AlchemyQueryError(error.message, AlchemyErrorType.TokenBalance);
  }
}

export interface TokenInfo {
  contractAddress: `0x${string}`;
  decimals: number;
  logo: null;
  name: string;
  symbol: string;
}

export async function alchemyTokenInfo(chainId: number, addresses: `0x${string}`[]): Promise<TokenInfo[]> {
  try {
    // Get token balances
    const response = await fetch(baseUrl(chainId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        addresses.map((address) => ({
          jsonrpc: '2.0',
          method: 'alchemy_getTokenMetadata',
          params: [address],
          id: 1,
        }))
      ),
    });
    const jsonResponse = await response.json();

    return jsonResponse.map((res: any, index: number) => ({
      contractAddress: addresses[index],
      ...res.result,
    }));
  } catch (error) {
    throw new AlchemyQueryError(error.message, AlchemyErrorType.TokenInfo);
  }
}
