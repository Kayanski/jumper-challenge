import { z } from "zod";

export enum BalanceQuerySchemaVersion {
    V1 = "v1",
}

export const BalanceQuerySchemaMessage: Record<BalanceQuerySchemaVersion, (address: string) => string> = {
    [BalanceQuerySchemaVersion.V1]: (address: string) => `I am signing into Jumper Exchange`,
};

export const BalanceQuerySchema = z.object({
    version: z.nativeEnum(BalanceQuerySchemaVersion),
    address: z.string().min(1, "Address is required").startsWith("0x"),
    signature: z.string().min(1, "Signature is required").startsWith("0x"),
});