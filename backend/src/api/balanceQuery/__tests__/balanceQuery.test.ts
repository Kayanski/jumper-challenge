import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { app } from '@/server';
import { AppDataSource } from '@/common/middleware/dataSource';
import { AllBalancesMessage, BalanceQueryMessage } from '@/schemas/status.schema';

describe('Balance Query Endpoint Succeeds', () => {
  beforeEach(async () => {
    // Cleaning all repositories
    const entities = AppDataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      await repository.clear();
    }
  });

  it('Get balance success', async () => {
    // We add the user
    const accountRepository = AppDataSource.getRepository('Account');
    const account = accountRepository.create({
      address: '0x0000000000000000000000000000000000000000',
      chainId: 1,
    });
    await accountRepository.save(account);

    const response = await request(app).get(
      '/balance-query?address=0x0000000000000000000000000000000000000000&chainId=1'
    );
    const result: ServiceResponse = response.body;

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(result.success).toBeTruthy();
    expect(result.responseObject).toBeInstanceOf(Array);
    expect(result.message).toEqual(BalanceQueryMessage);
  }, 10000);

  it('Get All Balances success', async () => {
    // We start by querying all balances, there should be nothing there
    {
      const response = await request(app).get('/balance-query/all');
      const result: ServiceResponse = response.body;
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.responseObject).toBeInstanceOf(Array);
      expect(result.responseObject).toHaveLength(0);
      expect(result.message).toEqual(AllBalancesMessage);
    }
    {
      // We add the user and fetch its tokens
      const accountRepository = AppDataSource.getRepository('Account');
      const account = accountRepository.create({
        address: '0x0000000000000000000000000000000000000000',
        chainId: 1,
      });
      await accountRepository.save(account);
      await request(app).get('/balance-query?address=0x0000000000000000000000000000000000000000&chainId=1');
    }
    // We fetch a second time and we should have more results now (0x0 address has tokens to its name on eth)
    {
      const response = await request(app).get('/balance-query/all');
      const result: ServiceResponse<any[]> = response.body;
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.responseObject).toBeInstanceOf(Array);
      expect(result.responseObject).not.toBeNull();
      expect(result.responseObject.length).not.toBe(0);
      expect(result.message).toEqual(AllBalancesMessage);
    }
  }, 10000);
});
