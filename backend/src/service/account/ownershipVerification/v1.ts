import { publicClient } from '@/common/evm/viemClient';
import { AccountCreationMessage, AccountCreationMessageParams, AccountCreationSchemaVersion } from '../../../schemas/AccountLifecycle.schema';

export async function verificationV1(params: AccountCreationMessageParams, signature: `0x${string}`) {
  const valid = await publicClient.verifyMessage({
    address: params.address as `0x${string}`,
    message: AccountCreationMessage[AccountCreationSchemaVersion.V1](params),
    signature: signature as `0x${string}`,
  });
  return valid;
}
