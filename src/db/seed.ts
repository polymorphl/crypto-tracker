import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { faker } from '@faker-js/faker';

import { Asset, Provider, assets, providers, transactions } from './schema';

if (!('DATABASE_URL' in process.env))
  throw new Error('DATABASE_URL not found on .env file');

const clearDb = async (db: any) => {
  const query = sql<string>`SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `;

  const tables = await db.execute(query);

  for (let table of tables.rows) {
    const query = sql.raw(`TRUNCATE TABLE ${table.table_name} CASCADE;`);
    await db.execute(query);
  }
};

const seedAssets = async (db: any) => {
  const assetsData: (typeof assets.$inferInsert)[] = [];
  // Insert
  assetsData.push({
    name: 'US Dollar',
    ticker: 'USD',
    type: 'fiat',
    amount: '0',
    price: '0',
  });
  assetsData.push({
    name: 'Bitcoin',
    ticker: 'BTC',
    type: 'crypto',
    amount: '0',
    price: '0',
    icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  });

  await db.insert(assets).values(assetsData);
};

const seedProviders = async (db: any) => {
  const providersData: (typeof providers.$inferInsert)[] = [];
  providersData.push({
    name: 'Binance',
    type: 'hot-wallet',
  });
  providersData.push({
    name: 'Coinbase',
    type: 'hot-wallet',
  });
  providersData.push({
    name: 'Ledger Nano X',
    type: 'cold-wallet',
  });

  await db.insert(providers).values(providersData);
};

const seedTransactions = async (db: any) => {
  const transactionsData: (typeof transactions.$inferInsert)[] = [];
  const assetsData = await db.select().from(assets);
  const providersData = await db.select().from(providers);
  const ledger = providersData.find(
    (provider: any) => provider.name === 'Ledger Nano X'
  ) as Provider;
  const bitcoin = assetsData.find(
    (asset: any) => asset.ticker === 'BTC'
  ) as Asset;

  for (let i = 0; i < 100; i++) {
    transactionsData.push({
      type: 'buy',
      asset_id: bitcoin.id,
      provider_id: ledger.id,
      amount: faker.finance.amount(0.01, 0.02, 8),
      price_per_unit_usd: faker.finance.amount(10000, 20000, 8),
    });
  }

  await db.insert(transactions).values(transactionsData);
};

const main = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);
  await clearDb(db);

  console.log('⚡️ Seed start');
  await seedAssets(db);
  await seedProviders(db);
  await seedTransactions(db);
  console.log('Seed done 👍');
  return client.end();
};

main();
