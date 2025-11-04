import { DataSource, EntitySchema, MixedList } from 'typeorm';
import { env } from '../utils/envConfig';
import { Account } from '@/models/Account.model';
import { TokenBalance } from '@/models/TokenBalance.model';
import { Token } from '@/models/Token.model';

let AppDataSource: DataSource;

const options: {
  entities: MixedList<Function | string | EntitySchema>;
  synchronize: boolean;
  logging: boolean;
} = {
  entities: [Account, TokenBalance, Token],
  synchronize: true,
  logging: false,
};

if (env.NODE_ENV == 'test') {
  (async () => {
    AppDataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      ...options,
    });
    // Initialize Datasource async
    AppDataSource.initialize();
  })();
} else {
  AppDataSource = new DataSource({
    type: 'postgres',
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    username: env.POSTGRES_USERNAME,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    ...options,
  });
  // Initialize Datasource async
  AppDataSource.initialize();
}

export { AppDataSource };
