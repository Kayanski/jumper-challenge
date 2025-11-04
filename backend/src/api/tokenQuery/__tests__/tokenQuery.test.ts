import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { app } from '@/server';
import { AppDataSource } from '@/common/middleware/dataSource';
import { TokenQueryMessage } from '@/schemas/status.schema';
describe('Token Query Endpoint Succeeds', () => {

    beforeEach(async () => {
        // Cleaning all repositories
        const entities = AppDataSource.entityMetadatas;

        for (const entity of entities) {
            const repository = AppDataSource.getRepository(entity.name);
            await repository.clear();
        }
    })

    it('Get All Tokens success', async () => {

        // We start by querying all tokens, there should be nothing there
        {
            const response = await request(app).get('/tokens');
            const result: ServiceResponse<any[]> = response.body;
            expect(response.statusCode).toEqual(StatusCodes.OK);
            expect(result.success).toBeTruthy();
            expect(result.responseObject).toBeInstanceOf(Array);
            expect(result.responseObject).toHaveLength(0);
            expect(result.message).toEqual(TokenQueryMessage);

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
            const response = await request(app).get('/tokens');
            const result: ServiceResponse<any[]> = response.body;
            expect(response.statusCode).toEqual(StatusCodes.OK);
            expect(result.success).toBeTruthy();
            expect(result.responseObject).toBeInstanceOf(Array);
            expect(result.responseObject).not.toBeNull();
            expect(result.responseObject.length).not.toBe(0)
            expect(result.message).toEqual(TokenQueryMessage);
        }
    }, 10000);
});
