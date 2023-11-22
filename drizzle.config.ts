import 'dotenv/config';
import type { Config } from 'drizzle-kit';

if (!('DATABASE_URL' in process.env))
  throw new Error('DATABASE_URL not found on .env file');

export default {
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  driver: 'pg',
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
} satisfies Config;
