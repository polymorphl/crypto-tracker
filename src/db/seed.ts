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
  assetsData.push({
    name: 'Ethereum',
    ticker: 'ETH',
    type: 'crypto',
    amount: '0',
    price: '0',
    icon: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png',
  });

  await db.insert(assets).values(assetsData);
};

const seedProviders = async (db: any) => {
  const providersData: (typeof providers.$inferInsert)[] = [];
  providersData.push({
    name: 'Binance',
    slug: 'binance',
    type: 'hot-wallet',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Binance_Logo.png',
  });
  providersData.push({
    name: 'Coinbase',
    slug: 'coinbase',
    type: 'hot-wallet',
    icon: 'https://companieslogo.com/img/orig/COIN-a63dbab3.png',
  });
  providersData.push({
    name: 'Ledger Nano X',
    slug: 'ledger-nano-x',
    type: 'cold-wallet',
    icon: 'https://www.ledger.com/wp-content/uploads/2023/08/Ledger-logo-696.png',
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
  const binance = providersData.find(
    (provider: any) => provider.name === 'Binance'
  ) as Provider;
  const coinbase = providersData.find(
    (provider: any) => provider.name === 'Coinbase'
  ) as Provider;
  const allProviders: Provider[] = [ledger, binance, coinbase];
  const btc = assetsData.find((asset: any) => asset.ticker === 'BTC') as Asset;
  const eth = assetsData.find((asset: any) => asset.ticker === 'ETH') as Asset;

  for (let i = 0; i < 50; i++) {
    const rand = faker.helpers.rangeToNumber({ min: 0, max: 5 });
    const randProvider = Math.floor(Math.random() * allProviders.length);
    transactionsData.push({
      type: 'buy',
      asset_id: rand % 2 ? btc.id : eth.id,
      provider_id: allProviders[randProvider].id,
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
