import { extendZodWithOpenApi, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';
extendZodWithOpenApi(z);

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';
import { publicClient } from '@/common/evm/viemClient';
import { StatusCodes } from 'http-status-codes';
import {
  AccountCreationSchema,
  AccountCreationSchemaMessage,
  AccountCreationSchemaVersion,
  AccountVerificationSchema,
} from './accountCreationSchema';
import { AppDataSource } from '@/server';
import { verification } from './verification';
import { Account } from '@/models/Account';

export const accountCreationRegistry = new OpenAPIRegistry();

export const accountCreationRouter: Router = (() => {
  const router = express.Router();

  accountCreationRegistry.registerPath({
    method: 'post',
    path: '/account-creation',
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
    tags: ['Account Creation'],
    responses: createApiResponse(z.null(), 'Success'),
  });

  accountCreationRegistry.registerPath({
    method: 'delete',
    path: '/account-creation',
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
    tags: ['Account Creation'],
    responses: createApiResponse(z.null(), 'Success'),
  });

  accountCreationRegistry.registerPath({
    method: 'get',
    path: '/account-creation/verify',
    request: {
      params: AccountVerificationSchema,
    },
    tags: ['Account Creation'],
    responses: createApiResponse(z.boolean(), 'Success'), // TODO
  });

  router.post('/', async (req: Request, res: Response) => {
    const accountRepository = AppDataSource.getRepository(Account);

    const { version, address, signature } = AccountCreationSchema.parse(req.body);
    console.log(await accountRepository.findOneBy({ address }));
    if (!(await accountRepository.findOneBy({ address }))) {
      await verification({ version, address: address as `0x${string}`, signature: signature as `0x${string}` });
      // We create the account in the database
      const account = new Account();
      account.address = address;
      account.chainId = 1; // For example, Ethereum Mainnet, TODO
      await accountRepository.save(account);
    }

    const serviceResponse = new ServiceResponse(ResponseStatus.Success, 'Account Created', null, StatusCodes.OK);
    handleServiceResponse(serviceResponse, res);
  });

  router.delete('/', async (req: Request, res: Response) => {
    const { version, address, signature } = AccountCreationSchema.parse(req.body);

    await verification({ version, address: address as `0x${string}`, signature: signature as `0x${string}` });

    // We create the account in the database
    const accountRepository = AppDataSource.getRepository(Account);
    await accountRepository.delete({ address: address });

    const serviceResponse = new ServiceResponse(ResponseStatus.Success, 'Account Deleted', null, StatusCodes.OK);
    handleServiceResponse(serviceResponse, res);
  });

  router.get('/verify', async (req: Request, res: Response) => {
    const { address } = AccountVerificationSchema.parse(req.query);
    const accountRepository = AppDataSource.getRepository(Account);
    const account = await accountRepository.findOneBy({ address: address });

    let serviceResponse: ServiceResponse<boolean>;
    if (account) {
      serviceResponse = new ServiceResponse(
        ResponseStatus.Success,
        'Account Verification Successful',
        true,
        StatusCodes.OK
      );
    } else {
      serviceResponse = new ServiceResponse(
        ResponseStatus.Success,
        'Account Verification Failed',
        false,
        StatusCodes.OK
      );
    }
    handleServiceResponse(serviceResponse, res);
    return;
  });

  return router;
})();
