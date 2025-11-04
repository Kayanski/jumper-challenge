import { extendZodWithOpenApi, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';
extendZodWithOpenApi(z);

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { StatusCodes } from 'http-status-codes';
import { AccountCreationSchema, AccountVerificationSchema } from '../../schemas/AccountLifecycle.schema';
import { verification } from '../../service/account/ownershipVerification';
import { Account } from '@/models/Account.model';
import { createAccount, deleteAccount, verifyAccount } from '@/service/account/account.service';
import { AccountCreatedMessage, AccountDeletedMessage, AccountVerificationFailedMessage, AccountVerificationSuccessMessage } from '@/schemas/status.schema';

export const accountCreationRegistry = new OpenAPIRegistry();

export const accountCreationRouter: Router = (() => {
  const router = express.Router();

  accountCreationRegistry.registerPath({
    method: 'post',
    path: '/account',
    description: "Create an account associated with the user address if the user's signature is valid.",
    request: {
      body: {
        content: {
          'application/json': {
            schema: AccountCreationSchema,
          },
        },
        required: true,
      },
    },
    tags: ['Account'],
    responses: createApiResponse(z.null(), 'Success'),
  });

  router.post('/', async (req: Request, res: Response) => {
    const { version, address, signature, chainId } = AccountCreationSchema.parse(req.body);
    await createAccount({ version, address, signature, chainId });

    const serviceResponse = new ServiceResponse(ResponseStatus.Success, AccountCreatedMessage, null, StatusCodes.OK);
    handleServiceResponse(serviceResponse, res);
  });

  accountCreationRegistry.registerPath({
    method: 'delete',
    path: '/account',
    description: "Delete the account associated with the user address if the user's signature is valid.",
    request: {
      body: {
        content: {
          'application/json': {
            schema: AccountCreationSchema,
          },
        },
        required: true,
      },
    },
    tags: ['Account'],
    responses: createApiResponse(z.null(), 'Success'),
  });
  router.delete('/', async (req: Request, res: Response) => {
    const { version, address, signature, chainId } = AccountCreationSchema.parse(req.body);
    await deleteAccount({ version, address, signature, chainId });

    const serviceResponse = new ServiceResponse(ResponseStatus.Success, AccountDeletedMessage, null, StatusCodes.OK);
    handleServiceResponse(serviceResponse, res);
  });

  accountCreationRegistry.registerPath({
    method: 'get',
    path: '/account/verify',
    description: "Verify it the user address has already created an account",
    request: {
      params: AccountVerificationSchema,
    },
    tags: ['Account Creation'],
    responses: createApiResponse(z.boolean(), 'Success'),
  });
  router.get('/verify', async (req: Request, res: Response) => {
    const { address, chainId } = AccountVerificationSchema.parse(req.query);
    const hasAccount = await verifyAccount({ address, chainId });

    let serviceResponse: ServiceResponse<boolean>;
    if (hasAccount) {
      serviceResponse = new ServiceResponse(
        ResponseStatus.Success,
        AccountVerificationSuccessMessage,
        true,
        StatusCodes.OK
      );
    } else {
      serviceResponse = new ServiceResponse(
        ResponseStatus.Success,
        AccountVerificationFailedMessage,
        false,
        StatusCodes.OK
      );
    }
    handleServiceResponse(serviceResponse, res);
    return;
  });

  return router;
})();
