import { useCallback, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { useAccountCreation } from './useAccountCreation';
import { useOwnershipSignature } from '@/storage/signature';
import { useMutation } from '@tanstack/react-query';
import { sign } from 'crypto';

export const useVerifyOwnership = () => {
  const { address, chainId } = useAccount();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const { addSignature, getSignature } = useOwnershipSignature();
  const { mutateAsync: createAccount } = useAccountCreation();
  const { signMessageAsync } = useSignMessage({});

  const signAndCreateAccount = useMutation({
    mutationFn: async () => {
      if (!address || !chainId) {
        throw new Error('Unreachable, no account connected');
      }
      let signature = getSignature({
        address,
        chainId,
      });
      if (!signature) {
        signature = await signMessageAsync({
          message: JSON.stringify({
            message: 'Verify ownership of this address',
            address,
            chainId,
          }),
        });
        addSignature({ address, chainId }, signature);
      }
      await createAccount({ signature });
    },
  });

  return signAndCreateAccount;
};
