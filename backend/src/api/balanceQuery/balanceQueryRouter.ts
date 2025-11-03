import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { BalanceQuerySchema, BalanceQuerySchemaMessage, BalanceQuerySchemaVersion } from './balanceQuerySchema';
import { publicClient } from '@/common/evm/viemClient';
import { alchemyTokenBalances, alchemyTokenInfo } from '@/common/evm/alchemyTokenQueries';

export const balanceQueryRegistry = new OpenAPIRegistry();

export const balanceQueryRouter: Router = (() => {
    const router = express.Router();

    balanceQueryRegistry.registerPath({
        method: 'post',
        path: '/balance-query',
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: BalanceQuerySchema,
                    },
                },
                required: true,
            },
        },
        tags: ['Balance Query'],
        responses: createApiResponse(z.null(), 'Success'), // TODO
    });

    router.post('/', async (req: Request, res: Response) => {

        // Here we handle the balance query logic
        const { version, address, signature } = BalanceQuerySchema.parse(req.body);

        switch (version) {
            case BalanceQuerySchemaVersion.V1:
                // Handle version 1.0 logic
                const valid = await publicClient.verifyMessage({
                    address: address as `0x${string}`,
                    message: BalanceQuerySchemaMessage[BalanceQuerySchemaVersion.V1](address),
                    signature: signature as `0x${string}`,
                })
                if (!valid) {
                    throw new Error('Invalid signature'); // TODO custom error
                }

                const alchemyTokens = await alchemyTokenBalances(address as `0x${string}`);
                const tokenInfo = await alchemyTokenInfo(alchemyTokens.tokenBalances.map(tb => tb.contractAddress));

                const returnStruct = alchemyTokens.tokenBalances.map((tb, index) => {
                    const info = tokenInfo.find(ti => ti.contractAddress === tb.contractAddress)!;
                    return {
                        contractAddress: tb.contractAddress,
                        tokenBalance: tb.tokenBalance,
                        decimals: info.decimals,
                        logo: info.logo,
                        name: info.name,
                        symbol: info.symbol,
                    };
                });

                const serviceResponse = new ServiceResponse(ResponseStatus.Success, 'Service is healthy', returnStruct, StatusCodes.OK);
                handleServiceResponse(serviceResponse, res);

                break;
            default:
                throw new Error('Unsupported schema version');
                break;
        }

    });

    return router;
})();
