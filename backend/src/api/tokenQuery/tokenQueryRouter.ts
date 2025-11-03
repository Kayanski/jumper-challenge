import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from '@/server';
import { Token } from '@/models/Token';

export const tokenQueryRegistry = new OpenAPIRegistry();

export const tokenQueryRouter: Router = (() => {
    const router = express.Router();

    tokenQueryRegistry.registerPath({
        method: 'get',
        path: '/token',
        tags: ['Token Query'],
        responses: createApiResponse(z.null(), 'Success'), // TODO
    });


    router.get('/', async (req: Request, res: Response) => {
        // Here we handle the balance query logic
        const tokenRegistry = AppDataSource.getRepository(Token);

        const tokens = await tokenRegistry.find()
        const serviceResponse = new ServiceResponse(ResponseStatus.Success, 'Service is healthy', tokens, StatusCodes.OK);
        handleServiceResponse(serviceResponse, res);
    });

    return router;
})();
