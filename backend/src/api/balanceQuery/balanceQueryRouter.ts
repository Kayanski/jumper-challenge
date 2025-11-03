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
import { AppDataSource } from '@/server';
import { TokenBalance } from '@/models/TokenBalance';

export const balanceQueryRegistry = new OpenAPIRegistry();

export const balanceQueryRouter: Router = (() => {
    const router = express.Router();

    balanceQueryRegistry.registerPath({
        method: 'get',
        path: '/balance-query',
        request: {
            params: BalanceQuerySchema,
        },
        tags: ['Balance Query'],
        responses: createApiResponse(z.null(), 'Success'), // TODO
    });


    router.get('/', async (req: Request, res: Response) => {
        // Here we handle the balance query logic
        const { address } = BalanceQuerySchema.parse(req.query);

        const balanceResponse = await balanceQuery({ address });
        const serviceResponse = new ServiceResponse(ResponseStatus.Success, 'Service is healthy', balanceResponse, StatusCodes.OK);
        handleServiceResponse(serviceResponse, res);
    });

    balanceQueryRegistry.registerPath({
        method: 'get',
        path: '/balance-query/all',
        tags: ['Balance Query'],
        responses: createApiResponse(z.null(), 'Success'), // TODO
    });

    router.get('/all', async (req: Request, res: Response) => {
        const tokenBalancesRepository = AppDataSource.getRepository(TokenBalance);

        const balances = tokenBalancesRepository.find()

        const serviceResponse = new ServiceResponse(ResponseStatus.Success, 'Service is healthy', balances, StatusCodes.OK);
        handleServiceResponse(serviceResponse, res);
    });

    return router;
})();
