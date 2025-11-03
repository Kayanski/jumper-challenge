import { publicClient } from "@/common/evm/viemClient";
import { AccountCreationSchemaMessage, AccountCreationSchemaVersion } from "../accountCreationSchema";

export async function verificationV1(address: `0x${string}`, signature: `0x${string}`) {
    const valid = await publicClient.verifyMessage({
        address: address as `0x${string}`,
        message: AccountCreationSchemaMessage[AccountCreationSchemaVersion.V1](address),
        signature: signature as `0x${string}`,
    })
    return valid
}