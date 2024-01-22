import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { faker } from '@faker-js/faker';

import {
  Asset,
  Provider,
  User,
  assets,
  links,
  providers,
  raw_imports,
  transactions,
  users,
} from './schema';

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

const seedUsers = async (db: any) => {
  const usersData: (typeof users.$inferInsert)[] = [];
  usersData.push({
    email: 'luc@test.co',
    password: '123456',
  });

  await db.insert(users).values(usersData);
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

const seedLinks = async (db: any) => {
  const linksData: (typeof links.$inferInsert)[] = [];
  const assetsData = await db.select().from(assets);
  const providersData = await db.select().from(providers);
  const userId = (await db.select().from(users))[0].id;
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
    const p = allProviders[randProvider];
    const pType = p.type === 'hot-wallet' ? 'platform' : 'cold-wallet';
    linksData.push({
      type: pType,
      asset_id: rand % 2 ? btc.id : eth.id,
      asset_slug: rand % 2 ? btc.ticker : eth.ticker,
      provider_id: p.id,
      user_id: userId,
      url: '',
    });
  }

  await db.insert(links).values(linksData);
};

const seedTransactions = async (db: any) => {
  const linksData = await db.select().from(links);
  const transactionsData: (typeof transactions.$inferInsert)[] = [];
  const userId = (await db.select().from(users))[0].id;

  for (let i = 0; i < 100; i++) {
    const rand = faker.helpers.rangeToNumber({
      min: 0,
      max: linksData.length - 1,
    });
    transactionsData.push({
      type: 'buy',
      link_id: linksData[rand].id,
      amount: faker.finance.amount(0.001, 0.006, 8),
      price_per_unit: faker.finance.amount(100, 200, 8),
      user_id: userId,
      created_at: faker.date.past({ years: 1 }),
    });
  }

  await db.insert(transactions).values(transactionsData);
};

const seedFiles = async (db: any) => {
  const filesData: (typeof raw_imports.$inferInsert)[] = [];
  const userId = (await db.select().from(users))[0].id;

  for (let i = 0; i < 100; i++) {
    const rand = faker.helpers.rangeToNumber({
      min: 0,
      max: 100000,
    });
    filesData.push({
      user_id: userId,
      name: faker.system.fileName(),
      path: faker.system.filePath(),
      type: faker.system.mimeType(),
      size: rand,
      created_at: faker.date.past({ years: 1 }),
    });
  }

  await db.insert(raw_imports).values(filesData);
};

const main = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);
  await clearDb(db);

  console.log('⚡️ Seed start');
  await seedUsers(db);
  await seedAssets(db);
  await seedProviders(db);
  await seedLinks(db);
  await seedTransactions(db);
  await seedFiles(db);
  console.log('Seed done 👍');
  return client.end();
};

main();
