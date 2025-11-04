import { env } from '@/common/utils/envConfig';
import { getAlchemyEndpoint } from './alchemyEnpoint';

const apiKey = env.ALCHEMY_API_KEY;

function baseUrl(chainId: number): URL {
  const alchemyEndpoint = getAlchemyEndpoint(chainId);
  return new URL(`/v2/${apiKey}`, alchemyEndpoint);
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
}

export interface TokenInfo {
  contractAddress: `0x${string}`;
  decimals: number;
  logo: null;
  name: string;
  symbol: string;
}

export async function alchemyTokenInfo(chainId: number, addresses: `0x${string}`[]): Promise<TokenInfo[]> {
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
}
