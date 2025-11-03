import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { BalanceQuerySchema } from './balanceQuerySchema';
import { publicClient } from '@/common/evm/viemClient';
import { alchemyTokenBalances, alchemyTokenInfo } from '@/common/evm/alchemyTokenQueries';
import { StatusCodes } from 'http-status-codes';
import { balanceQuery } from './query';

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
        const { address } = BalanceQuerySchema.parse(req.body);

        const balanceResponse = await balanceQuery({ address });
        const serviceResponse = new ServiceResponse(ResponseStatus.Success, 'Service is healthy', balanceResponse, StatusCodes.OK);
        handleServiceResponse(serviceResponse, res);

    });

    return router;
})();
