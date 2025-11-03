import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { publicClient } from '@/common/evm/viemClient';
import { StatusCodes } from 'http-status-codes';
import { AccountCreationSchema, AccountCreationSchemaMessage, AccountCreationSchemaVersion } from './accountCreationSchema';
import { Account } from '@/models/account';
import { AppDataSource } from '@/server';

export const accountCreationRegistry = new OpenAPIRegistry();

export const accountCreationRouter: Router = (() => {
    const router = express.Router();

    accountCreationRegistry.registerPath({
        method: 'post',
        path: '/account-creation',
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: AccountCreationSchema,
                    },
                },
                required: true,
            },
        },
        tags: ['Account Creation'],
        responses: createApiResponse(z.null(), 'Success'),
    });

    router.post('/', async (req: Request, res: Response) => {
        const accountRepository = AppDataSource.getRepository(Account)

        const { version, address, signature } = AccountCreationSchema.parse(req.body);

        switch (version) {
            case AccountCreationSchemaVersion.V1:
                // Handle version 1.0 logic
                const valid = await publicClient.verifyMessage({
                    address: address as `0x${string}`,
                    message: AccountCreationSchemaMessage[AccountCreationSchemaVersion.V1](address),
                    signature: signature as `0x${string}`,
                })
                if (!valid) {
                    throw new Error('Invalid signature'); // TODO custom error
                }

                // We create the account in the database

                const account = new Account()
                account.address = address
                account.chainId = 1 // For example, Ethereum Mainnet, TODO

                await accountRepository.save(account)

                const serviceResponse = new ServiceResponse(ResponseStatus.Success, 'Account Created', null, StatusCodes.OK);
                handleServiceResponse(serviceResponse, res);
                break;
            default:
                throw new Error('Unsupported schema version');
                break;
        }

    });

    return router;
})();
