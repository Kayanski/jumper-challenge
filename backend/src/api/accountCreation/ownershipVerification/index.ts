import { AccountCreationSchemaVersion } from '../../../schemas/accountCreationSchema';
import { verificationV1 } from './v1';


export async function verification({
  version,
  chainId,
  address,
  signature,
}: {
  version: AccountCreationSchemaVersion;
  chainId: number;
  address: `0x${string}`;
  signature: `0x${string}`;
}) {
  let valid: boolean;
  switch (version) {
    case AccountCreationSchemaVersion.V1:
      valid = await verificationV1({ address, chainId }, signature);
      break;
    default:
      throw new Error('Unsupported schema version');
  }
  if (!valid) {
    throw new Error('Invalid signature'); // TODO custom error
  }
}
