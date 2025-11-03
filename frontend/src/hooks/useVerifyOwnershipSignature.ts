import { useCallback, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useAccountCreation } from "./useAccountCreation";
import { useOwnershipSignature } from "@/storage/signature";

export const useVerifyOwnership = () => {

    const { address, chainId } = useAccount();
    const [isCreatingAccount, setIsCreatingAccount] = useState(false)
    const { addSignature, getSignature } = useOwnershipSignature();
    const { mutateAsync: createAccount } = useAccountCreation();
    const { signMessage } = useSignMessage({})

    const signAndCreateAccount = useCallback(async () => {

        if (!address || !chainId) {
            throw new Error("Unreachable, no account connected");
        }
        setIsCreatingAccount(true)
        const signature = getSignature({
            address, chainId
        })
        if (!signature) {
            signMessage({
                message: JSON.stringify({
                    message: "Verify ownership of this address",
                    address,
                    chainId
                })
            }, {
                onSuccess(data) {
                    addSignature({ address, chainId }, data);
                    createAccount({ signature: data }).finally(() => {
                        setIsCreatingAccount(false)
                    });
                },
                onError() {
                    setIsCreatingAccount(false)
                }
            });
        } else {
            createAccount({ signature }).finally(() => {
                setIsCreatingAccount(false)
            });
        }


    }, [address, chainId, createAccount, setIsCreatingAccount, getSignature, addSignature, signMessage]);


    return {
        signAndCreateAccount,
        isCreatingAccount
    }

}