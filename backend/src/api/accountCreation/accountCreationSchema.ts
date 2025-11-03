import { z } from "zod";

export enum AccountCreationSchemaVersion {
    V1 = "v1",
}

export const AccountCreationSchemaMessage: Record<AccountCreationSchemaVersion, (address: string) => string> = {
    [AccountCreationSchemaVersion.V1]: (address: string) => `I am signing into Jumper Exchange`,
};

export const AccountCreationSchema = z.object({
    version: z.nativeEnum(AccountCreationSchemaVersion),
    address: z.string().min(1, "Address is required").startsWith("0x"),
    signature: z.string().min(1, "Signature is required").startsWith("0x"),
});

export const AccountVerificationSchema = z.object({
    address: z.string().min(1, "Address is required").startsWith("0x"),
})