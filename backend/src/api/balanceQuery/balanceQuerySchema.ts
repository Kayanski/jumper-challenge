import { z } from "zod";


export const BalanceQuerySchema = z.object({
    address: z.string().min(1, "Address is required").startsWith("0x"),
});