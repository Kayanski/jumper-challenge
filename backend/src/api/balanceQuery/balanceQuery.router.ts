import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import {
  AllBalancesResponseSchema,
  BalanceQuerySchema,
  BalanceResponseSchema,
} from '../../schemas/BalanceQuery.schema';
import { publicClient } from '@/common/evm/viemClient';
import { alchemyTokenBalances, alchemyTokenInfo } from '@/common/evm/alchemyTokenQueries';
import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from '@/server';
import { TokenBalance } from '@/models/TokenBalance.model';
import { balanceQuery, getAllBalances } from '@/service/balance/balanceQuery.service';

export const balanceQueryRegistry = new OpenAPIRegistry();

export const balanceQueryRouter: Router = (() => {
  const router = express.Router();

  balanceQueryRegistry.registerPath({
    method: 'get',
    path: '/balance-query',
    request: {
      query: BalanceQuerySchema,
    },
    tags: ['Balance Query'],
    responses: createApiResponse(BalanceResponseSchema, 'Success'),
  });

  router.get('/', async (req: Request, res: Response) => {
    const { address, chainId } = BalanceQuerySchema.parse(req.query);

    const balanceResponse = await balanceQuery({ address, chainId });
    const serviceResponse = new ServiceResponse(
      ResponseStatus.Success,
      'Query balance for address successful',
      balanceResponse,
      StatusCodes.OK
    );
    handleServiceResponse(serviceResponse, res);
  });

  balanceQueryRegistry.registerPath({
    method: 'get',
    path: '/balance-query/all',
    tags: ['Balance Query'],
    responses: createApiResponse(AllBalancesResponseSchema, 'Success'),
  });

  router.get('/all', async (req: Request, res: Response) => {
    const balances = await getAllBalances();

    const serviceResponse = new ServiceResponse(
      ResponseStatus.Success,
      'All Balances fetched',
      balances,
      StatusCodes.OK
    );
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
