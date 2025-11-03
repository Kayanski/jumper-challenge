import { TokenBalanceWithInfo } from "@/hooks/useQueryTokenBalances";
import { BackendResponse } from "./backendResponse";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_ADDRESS!;

export async function backendAccountCreation(address: `0x${string}`, signature: `0x${string}`): Promise<BackendResponse<TokenBalanceWithInfo[]>> {

    const tokenBalanceUrl = new URL("account-creation", baseUrl,);
    // Get token balances
    const response = await fetch(tokenBalanceUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            version: "v1",
            address: address,
            signature: signature,
        })
    });
    const jsonResponse = await response.json();
    return jsonResponse
}