import { AppDataSource } from '@/common/middleware/dataSource';
import { Token } from '@/models/Token.model';

/// Queries all the tokens saved in the database
export async function getAllTokens() {
  const tokenRegistry = AppDataSource.getRepository(Token);

  const tokens = await tokenRegistry.find();
  return tokens;
}
