import { env } from "../utils/envConfig";

export function getAlchemyEndpoint(chainId: number): string {
    switch (chainId) {
        case 1:
            return env.ALCHEMY_ETHEREUM_ENDPOINT!;
        case 10:
            return env.ALCHEMY_OPTIMISM_ENDPOINT!;
        case 137:
            return env.ALCHEMY_POLYGON_ENDPOINT!;
        case 42161:
            return env.ALCHEMY_ARBITRUM_ENDPOINT!;
        case 8453:
            return env.ALCHEMY_BASE_ENDPOINT!;
        case 43114:
            return env.ALCHEMY_AVAX_ENDPOINT!;
        default:
            throw new Error(`Unsupported chain ID: ${chainId}`);
    }
}