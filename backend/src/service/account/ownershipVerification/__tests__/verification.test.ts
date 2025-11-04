import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { app } from '@/server';
import { AppDataSource } from '@/common/middleware/dataSource';
import { AllBalancesMessage, BalanceQueryMessage } from '@/schemas/status.schema';
import { verification } from '..';
import { createWalletClient, http } from 'viem';
import { avalanche, mainnet, optimism } from 'viem/chains';
import { AccountCreationMessage, AccountCreationSchemaVersion } from '@/schemas/AccountLifecycle.schema';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

describe('Signature Verification Works', () => {

    [mainnet, optimism, avalanche].forEach(function (chain) {
        it(`Simple User signature verification V1 ${chain.id}`, async () => {
            const privateKey = generatePrivateKey()
            const account = privateKeyToAccount(privateKey)

            const address = account.address
            const message = AccountCreationMessage[AccountCreationSchemaVersion.V1]({
                address, chainId: chain.id
            });
            const signature = await account.signMessage({
                message
            });
            await verification({ version: AccountCreationSchemaVersion.V1, address, signature, chainId: chain.id });
        });
    });

});
