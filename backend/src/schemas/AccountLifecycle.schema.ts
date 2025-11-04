import { z } from 'zod';

export enum AccountCreationSchemaVersion {
  V1 = 'v1',
}

export interface AccountCreationMessageParams {
  address: string;
  chainId: number;
}

export const AccountCreationMessage: Record<
  AccountCreationSchemaVersion,
  (params: AccountCreationMessageParams) => string
> = {
  [AccountCreationSchemaVersion.V1]: ({ address, chainId }) =>
    JSON.stringify({
      message: 'Verify ownership of this address',
      address,
      chainId,
    }),
};

export const AccountCreationSchema = z.object({
  version: z.nativeEnum(AccountCreationSchemaVersion),
  address: z.string().min(1, 'Address is required').startsWith('0x'),
  chainId: z.number().positive(),
  signature: z.string().min(1, 'Signature is required').startsWith('0x'),
});

export const AccountVerificationSchema = z.object({
  address: z.string().min(1, 'Address is required').startsWith('0x'),
  chainId: z.string().transform((val) => parseInt(val, 10)),
});

export const AccountResponseSchema = z.object({
  id: z.number(),
  chainId: z.number().min(1),
  address: z.string().min(1).startsWith('0x'),
});
