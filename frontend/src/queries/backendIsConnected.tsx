import { TokenBalanceWithInfo } from "@/hooks/useQueryTokenBalances";
import { BackendResponse } from "./backendResponse";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_ADDRESS!;

export async function backendIsConnected(address: `0x${string}`): Promise<BackendResponse<boolean>> {

    const accountVerificationUrl = new URL("account-creation/verify", baseUrl,);
    accountVerificationUrl.searchParams.append("address", address);

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