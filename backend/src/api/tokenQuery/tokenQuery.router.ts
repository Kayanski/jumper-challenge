import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from '@/server';
import { Token } from '@/models/Token.model';
import { TokenMetadataResponseSchema } from '@/schemas/TokenQuery.schema';
import { getAllTokens } from '@/service/tokens/tokens.service';

export const tokenQueryRegistry = new OpenAPIRegistry();

// One should add other routes to query tokens by different parameters
export const tokenQueryRouter: Router = (() => {
  const router = express.Router();

  tokenQueryRegistry.registerPath({
    method: 'get',
    path: '/tokens',
    tags: ['Token Query'],
    responses: createApiResponse(TokenMetadataResponseSchema, 'Success'),
  });

  router.get('/', async (req: Request, res: Response) => {
    const tokens = await getAllTokens();
    const serviceResponse = new ServiceResponse(
      ResponseStatus.Success,
      'Query all tokens success',
      tokens,
      StatusCodes.OK
    );
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
