export type BackendResponse<T> = {
    success: boolean;
    message: string;
    responseObject: T;
    statusCode: number;
}


export interface TokenBalance {
    contractAddress: `0x${string}`;
    tokenBalance: bigint;
}

export interface TokenBalances {
    address: `0x${string}`;
    tokenBalances: TokenBalance[]
}
