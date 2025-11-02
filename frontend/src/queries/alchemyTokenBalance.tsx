const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const baseURL = `https://avax-mainnet.g.alchemy.com/v2/${apiKey}`;

export interface TokenBalance {
    contractAddress: `0x${string}`;
    tokenBalance: bigint;
}

export interface TokenBalances {
    address: `0x${string}`;
    tokenBalances: TokenBalance[]
}

export async function alchemyTokenBalances(address: `0x${string}`): Promise<TokenBalances> {
    // Get token balances
    const response = await fetch(baseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: "alchemy_getTokenBalances",
            params: [address],
            id: 1
        })
    });
    const jsonResponse = await response.json();
    return jsonResponse.result
}

export interface TokenInfo {
    contractAddress: `0x${string}`,
    decimals: number,
    logo: null,
    name: string,
    symbol: string,
}

export async function alchemyTokenInfo(addresses: `0x${string}`[]): Promise<TokenInfo[]> {
    // Get token balances
    const response = await fetch(baseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(addresses.map(address => ({
            jsonrpc: "2.0",
            method: "alchemy_getTokenMetadata",
            params: [address],
            id: 1
        })))
    });
    const jsonResponse = await response.json();
    return jsonResponse.map((res: any, index: number) => ({
        contractAddress: addresses[index],
        ...res.result
    }))
}