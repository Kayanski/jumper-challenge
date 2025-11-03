import { TokenBalanceWithInfo } from "@/hooks/useQueryTokenBalances";
import { BackendResponse } from "./backendResponse";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_ADDRESS!;

export async function backendTokenBalances(address: `0x${string}`): Promise<BackendResponse<TokenBalanceWithInfo[]>> {

    const tokenBalanceUrl = new URL("balance-query", baseUrl,);
    tokenBalanceUrl.searchParams.append("address", address);
    // Get token balances
    const response = await fetch(tokenBalanceUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const jsonResponse = await response.json();
    return jsonResponse
}