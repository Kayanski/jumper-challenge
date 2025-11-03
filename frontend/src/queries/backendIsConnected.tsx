import { TokenBalanceWithInfo } from "@/hooks/useQueryTokenBalances";
import { BackendResponse } from "./backendResponse";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_ADDRESS!;

export interface BackendIsConnectedParams {
    address: `0x${string}`;
    chainId: number;
}

export async function backendIsConnected({ address, chainId }: BackendIsConnectedParams): Promise<BackendResponse<boolean>> {

    const accountVerificationUrl = new URL("account-creation/verify", baseUrl,);
    accountVerificationUrl.searchParams.append("address", address);
    accountVerificationUrl.searchParams.append("chainId", chainId.toString());

    // Get account verification situation
    const response = await fetch(accountVerificationUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const jsonResponse = await response.json();
    return jsonResponse
}