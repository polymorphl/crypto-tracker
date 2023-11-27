import 'server-only';

import { asc, eq } from 'drizzle-orm';
import { PgSelect, PgSelectQueryBuilder } from 'drizzle-orm/pg-core';

import { db } from '@/db';
import {
  Asset,
  Provider,
  Transaction,
  assets,
  providers,
  transactions,
} from '@/db/schema';

export type TransactionDto = {
  id: number;
  type: 'buy' | 'deposit' | 'sell' | 'withdrawal';
  amount: string;
  asset_id: number;
  provider_id: number;
  price_per_unit_usd: string;
  note: string | null;
  linked_url: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  asset?: Asset;
  provider?: Provider;
};

export type CreateTransactionDto = {
  type: 'buy' | 'deposit' | 'sell' | 'withdrawal';
  amount: string;
  asset_id: number;
  provider_id: number;
  price_per_unit_usd: string;
  note: string | null;
  linked_url: string | null;
};

type TransactionWithRelations = Transaction & {
  asset: Asset;
  provider: Provider;
};

function mapCommonProperties(
  transaction: Transaction | Partial<TransactionWithRelations>
) {
  return {
    id: transaction.id,
    type: transaction.type,
    amount: transaction.amount,
    asset_id: transaction.asset_id,
    provider_id: transaction.provider_id,
    price_per_unit_usd: transaction.price_per_unit_usd,
    note: transaction.note,
    linked_url: transaction.linked_url,
    created_at: transaction.created_at,
    updated_at: transaction.updated_at,
  };
}

function toDtoMapper(
  item: Transaction | Partial<TransactionWithRelations>
): any {
  if ('asset' in item && 'provider' in item) {
    const transactionWithRelations = item as TransactionWithRelations;
    const commonProperties = mapCommonProperties(transactionWithRelations);
    return {
      ...commonProperties,
      asset: transactionWithRelations.asset,
      provider: transactionWithRelations.provider,
    };
  } else {
    const transaction = item as Transaction;
    const commonProperties = mapCommonProperties(transaction);
    return {
      ...commonProperties,
    };
  }
}

function withPagination<T extends PgSelect>(
  qb: T,
  page: number,
  pageSize: number = 20
) {
  return qb.limit(pageSize).offset(page * pageSize);
}

function withRelations<T extends PgSelectQueryBuilder>(qb: T) {
  return qb
    .leftJoin(assets, eq(transactions.asset_id, assets.id))
    .leftJoin(providers, eq(transactions.provider_id, providers.id));
}

function getQuery() {
  return db
    .select()
    .from(transactions)
    .orderBy(asc(transactions.created_at))
    .$dynamic();
}

// function get

export async function getTransactions(page = 1): Promise<TransactionDto[]> {
  let query = getQuery();

  const rows = await withPagination(withRelations(query), page);

  console.log(rows);

  const result = rows.reduce((accArr, row) => {
    const txn = row.transactions;
    const asset = row.assets;
    const provider = row.providers;

    const updatedAcc = { ...txn } as TransactionWithRelations;

    if (asset) {
      updatedAcc.asset = asset;
    }

    if (provider) {
      updatedAcc.provider = provider;
    }

    accArr.push(updatedAcc);
    return accArr;
  }, [] as TransactionDto[]);

  return result;
}

export async function getTransactionById(
  transactionId: number
): Promise<TransactionDto | undefined> {
  const foundTxn = await db.query.transactions.findFirst({
    where: eq(transactions.id, transactionId),
  });

  if (!foundTxn) {
    return undefined;
  }

  return toDtoMapper(foundTxn);
}

export async function createProvider(provider: CreateTransactionDto) {
  await db.insert(transactions).values(provider);
}
