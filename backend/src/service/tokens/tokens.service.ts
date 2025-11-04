import { Token } from "@/models/Token.model";
import { AppDataSource } from "@/server";

/// Queries all the tokens saved in the database
export async function getAllTokens() {
    const tokenRegistry = AppDataSource.getRepository(Token);

    const tokens = await tokenRegistry.find();
    return tokens;
}