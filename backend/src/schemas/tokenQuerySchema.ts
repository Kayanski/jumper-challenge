import { z } from 'zod';

export const TokenMetadataResponseSchema = z.array(z.object({
    id: z.number(),
    chainId: z.number(),
    contractAddress: z.string().startsWith('0x'),
    tokenBalance: z.string(),
    decimals: z.number(),
    logo: z.string().nullable(),
    name: z.string(),
    symbol: z.string(),
}));