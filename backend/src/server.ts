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
import { balanceQueryRouter } from './api/balanceQuery/balanceQuery.router';
import { accountCreationRouter } from './api/account/account.router';
import { DataSource } from 'typeorm';
import { Account } from './models/Account.model';
import { TokenBalance } from './models/TokenBalance.model';
import { Token } from './models/Token.model';
import { tokenQueryRouter } from './api/tokenQuery/tokenQuery.router';

const logger = pino({ name: 'server start' });
const app: Express = express();

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
app.use('/account', accountCreationRouter);
app.use('/balance-query', balanceQueryRouter);
app.use('/tokens', tokenQueryRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
