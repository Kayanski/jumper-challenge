import { TokenBalanceWithInfo } from '@/hooks/useQueryTokenBalances';
import { BackendResponse } from './backendResponse';

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_ADDRESS!;

export interface BackendTokenBalancesParams {
  address: `0x${string}`;
  chainId: number;
}

export async function backendTokenBalances({
  address,
  chainId,
}: BackendTokenBalancesParams): Promise<BackendResponse<TokenBalanceWithInfo[]>> {
  const tokenBalanceUrl = new URL('balance-query', baseUrl);
  tokenBalanceUrl.searchParams.append('address', address);
  tokenBalanceUrl.searchParams.append('chainId', chainId.toString());
  // Get token balances
  const response = await fetch(tokenBalanceUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}

export interface TokenBalancesResponse {
  id: number;
  chainId: number;
  address: `0x${string}`;
  balances: TokenBalance[];
}
export interface TokenBalance {
  id: number;
  token: TokenMetadata;
  userBalance: string;
}
export interface TokenMetadata {
  id: number;
  chainId: number;
  contractAddress: `0x${string}`;
  decimals: number;
  logo: string | null;
  name: string;
  symbol: string;
}

export async function backendLeaderBoard(): Promise<BackendResponse<TokenBalancesResponse[]>> {
  const tokenBalanceUrl = new URL('balance-query/all', baseUrl);
  // Get token balances
  const response = await fetch(tokenBalanceUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}
