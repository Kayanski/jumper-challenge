import { backendTokenBalances } from "@/queries/backenTokenBalance";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useIsConnected } from "./useIsConnected";

export interface TokenBalanceWithInfo {
  contractAddress: `0x${string}`;
  tokenBalance: bigint;
  decimals: number;
  logo: null;
  name: string;
  symbol: string;
}

export function useQueryTokenBalances() {
  const { data: isConnected } = useIsConnected();
  const { address, chainId } = useAccount();

  return useQuery<TokenBalanceWithInfo[]>({
    enabled: !!address && !!isConnected && !!chainId,
    queryKey: ["tokenBalances", chainId, address],
    queryFn: async () => {
      if (!address || !chainId) {
        throw new Error("Unreachable, no account connected");
      }
      if (!isConnected) {
        throw new Error("Unreachable, Account is not connected to the backend");
      }
      const backendTokens = await backendTokenBalances({ address, chainId });
      return backendTokens.responseObject;
    },
  });
}
