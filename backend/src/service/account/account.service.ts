import { Account } from '@/models/Account.model';
import { AccountCreationSchemaVersion } from '@/schemas/AccountLifecycle.schema';
import { AppDataSource } from '@/server';
import { verification } from './ownershipVerification';

interface CreateAccountParams {
  version: AccountCreationSchemaVersion;
  address: string;
  signature: string;
  chainId: number;
}

export async function createAccount({ version, address, signature, chainId }: CreateAccountParams) {
  const accountRepository = AppDataSource.getRepository(Account);

  if (!(await accountRepository.findOneBy({ address, chainId }))) {
    await verification({ version, address: address as `0x${string}`, signature: signature as `0x${string}`, chainId });

    // We create the account in the database
    const account = new Account();
    account.address = address;
    account.chainId = chainId;
    await accountRepository.save(account);
  }
}

export async function deleteAccount({ version, address, signature, chainId }: CreateAccountParams) {
  await verification({ version, address: address as `0x${string}`, signature: signature as `0x${string}`, chainId });

  // We delete the account from the database
  const accountRepository = AppDataSource.getRepository(Account);
  await accountRepository.delete({ address: address, chainId });
}

interface VerifiyAccountParams {
  address: string;
  chainId: number;
}

export async function verifyAccount({ address, chainId }: VerifiyAccountParams) {
  const accountRepository = AppDataSource.getRepository(Account);
  const account = await accountRepository.findOneBy({ address, chainId });

  return !!account;
}
