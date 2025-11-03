import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { openAPIRouter } from '@/api-docs/openAPIRouter';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';
import { balanceQueryRouter } from './api/balanceQuery/balanceQueryRouter';
import { accountCreationRouter } from './api/accountCreation/accountCreationRouter';
import { DataSource } from 'typeorm';
import { Account } from './models/Account';
import { TokenBalance } from './models/TokenBalance';
import { Token } from './models/Token';
import { tokenQueryRouter } from './api/tokenQuery/tokenQueryRouter';

const logger = pino({ name: 'server start' });
const app: Express = express();

// TypeORM
const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USERNAME,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  entities: [Account, TokenBalance, Token],
  synchronize: true,
  logging: false,
});
AppDataSource.initialize().then(() => {
  // Set the application to trust the reverse proxy
  app.set('trust proxy', true);

  // Middlewares
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(helmet());
  app.use(rateLimiter);
  app.use(express.json());

  // Request logging
  app.use(requestLogger);

  // Routes
  app.use('/health-check', healthCheckRouter);
  app.use('/account-creation', accountCreationRouter);
  app.use('/balance-query', balanceQueryRouter);
  app.use('/token', tokenQueryRouter);

  // Swagger UI
  app.use(openAPIRouter);

  // Error handlers
  app.use(errorHandler());
});

export { app, logger, AppDataSource };
