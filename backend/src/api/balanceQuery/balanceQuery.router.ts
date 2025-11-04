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
import { StatusCodes } from 'http-status-codes';
import { balanceQuery, getAllBalances } from '@/service/balance/balanceQuery.service';
import { AllBalancesMessage, BalanceQueryMessage } from '@/schemas/status.schema';

export const balanceQueryRegistry = new OpenAPIRegistry();

export const balanceQueryRouter: Router = (() => {
  const router = express.Router();

  balanceQueryRegistry.registerPath({
    method: 'get',
    path: '/balance-query',
    description: "Queries all the ERC-20 token balances for a given address on a specified chain. Errors of the user address is not registered with the platform",
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
      BalanceQueryMessage,
      balanceResponse,
      StatusCodes.OK
    );
    handleServiceResponse(serviceResponse, res);
  });

  balanceQueryRegistry.registerPath({
    method: 'get',
    path: '/balance-query/all',
    description: "Returns all the ERC-20 token balances for all registered users on the platform at the last time they queries their balances.",
    tags: ['Balance Query'],
    responses: createApiResponse(AllBalancesResponseSchema, 'Success'),
  });

  router.get('/all', async (req: Request, res: Response) => {
    const balances = await getAllBalances();

    const serviceResponse = new ServiceResponse(
      ResponseStatus.Success,
      AllBalancesMessage,
      balances,
      StatusCodes.OK
    );
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
