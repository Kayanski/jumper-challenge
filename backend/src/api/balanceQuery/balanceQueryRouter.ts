import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { BalanceQuerySchema, BalanceQuerySchemaMessage, BalanceQuerySchemaVersion } from './balanceQuerySchema';
import { publicClient } from '@/common/evm/viemClient';
import { alchemyTokenBalances, alchemyTokenInfo } from '@/common/evm/alchemyTokenQueries';
import { balanceQueryV1 } from './query/v1';
import { StatusCodes } from 'http-status-codes';

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
                const balanceResponse = await balanceQueryV1({ address, signature });
                const serviceResponse = new ServiceResponse(ResponseStatus.Success, 'Service is healthy', balanceResponse, StatusCodes.OK);
                handleServiceResponse(serviceResponse, res);
                break;
            default:
                throw new Error('Unsupported schema version');
                break;
        }

    });

    return router;
})();
