import { TokenBalanceWithInfo } from "@/hooks/useQueryTokenBalances";
import { BackendResponse } from "../queries/backendResponse";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_ADDRESS!;

export interface BackendAccountDeleteParams {
  address: `0x${string}`;
  signature: `0x${string}`;
  chainId: number;
}

export async function backendAccountDelete({
  address,
  signature,
  chainId,
}: BackendAccountDeleteParams): Promise<
  BackendResponse<TokenBalanceWithInfo[]>
> {
  const accountDeleteUrl = new URL("account", baseUrl);
  // Get token balances
  const response = await fetch(accountDeleteUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "v1",
      address,
      signature,
      chainId,
    }),
  });
  const jsonResponse = await response.json();
  return jsonResponse;
}
