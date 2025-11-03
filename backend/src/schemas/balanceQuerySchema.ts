import { z } from 'zod';
import { TokenMetadataResponseSchema } from './tokenQuerySchema';
import { AccountResponseSchema } from './accountCreationSchema';

export const BalanceQuerySchema = z.object({
  address: z.string().min(1, 'Address is required').startsWith('0x'),
  chainId: z.string().transform((val) => parseInt(val, 10))
});


export const BalanceResponseSchema = z.array(z.object({
  contractAddress: z.string().startsWith('0x'),
  tokenBalance: z.string(),
  decimals: z.number(),
  logo: z.string().nullable(),
  name: z.string(),
  symbol: z.string(),
}));

export const AllBalancesResponseSchema = z.array(z.object({
  id: z.number(),
  user: AccountResponseSchema,
  token: TokenMetadataResponseSchema,
  userBalance: z.string(),
}));
