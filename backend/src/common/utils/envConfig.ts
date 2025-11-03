import dotenv from 'dotenv';
import { cleanEnv, host, num, port, str, testOnly } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly('test'), choices: ['development', 'production', 'test'] }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3000') }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  ALCHEMY_API_KEY: str({}),
  ALCHEMY_ENDPOINT: str({}),
  POSTGRES_HOST: str({ devDefault: testOnly('localhost') }),
  POSTGRES_PORT: port({ devDefault: testOnly(5432) }),
  POSTGRES_USERNAME: str({ devDefault: testOnly('root') }),
  POSTGRES_PASSWORD: str({ devDefault: testOnly('admin') }),
  POSTGRES_DB: str({ devDefault: testOnly('test') }),
});
