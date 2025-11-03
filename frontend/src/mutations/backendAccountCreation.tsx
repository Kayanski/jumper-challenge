import { TokenBalanceWithInfo } from "@/hooks/useQueryTokenBalances";
import { BackendResponse } from "../queries/backendResponse";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_ADDRESS!;

export interface BackendAccountCreationParams {
    address: `0x${string}`;
    signature: `0x${string}`;
    chainId: number;
}

export async function backendAccountCreation({ address, signature, chainId }: BackendAccountCreationParams): Promise<BackendResponse<TokenBalanceWithInfo[]>> {

    const tokenBalanceUrl = new URL("account-creation", baseUrl,);
    // Get token balances
    const response = await fetch(tokenBalanceUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            version: "v1",
            address,
            signature,
            chainId
        })
    });
    const jsonResponse = await response.json();
    return jsonResponse
}