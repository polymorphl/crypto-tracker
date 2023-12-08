import 'server-only';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { desc, eq, sql } from 'drizzle-orm';
import { PgSelect, PgSelectQueryBuilder } from 'drizzle-orm/pg-core';

import { db } from '@/db';
import {
  Asset,
  Link,
  Provider,
  Transaction,
  assets,
  links,
  providers,
  transactions,
} from '@/db/schema';
import { getAssetByTicker } from './assets';
import { getProviderBySlug } from './providers';

export type TransactionDto = {
  id: number;
  type: 'buy' | 'deposit' | 'sell' | 'withdrawal';
  amount: string;
  link_id: number;
  user_id: string;
  price_per_unit: string;
  note: string | null;
  linked_url: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  asset?: Asset;
  link?: Link;
  provider?: Provider;
};

type TransactionWithRelations = Transaction & {
  link: Link;
  asset: Asset;
  provider: Provider;
};

type PaginatedResults = {
  data: TransactionDto[];
  count: number;
};

type PaginatedResultsWithTotalAmount = PaginatedResults & {
  total_amount: number;
};

const { getUser } = getKindeServerSession();
const user = await getUser();

/**
 * Maps the common properties of a transaction object.
 *
 * @param transaction - The transaction object to map.
 * @returns An object containing the common properties of the transaction.
 */
function mapCommonProperties(
  transaction: Transaction | Partial<TransactionWithRelations>
) {
  return {
    id: transaction.id,
    type: transaction.type,
    amount: transaction.amount,
    link_id: transaction.link_id,
    user_id: transaction.user_id,
    price_per_unit: transaction.price_per_unit,
    note: transaction.note,
    linked_url: transaction.linked_url,
    created_at: transaction.created_at,
    updated_at: transaction.updated_at,
  };
}

/**
 * Maps a Transaction or Partial<TransactionWithRelations> object to a DTO object.
 * @param item The input object to be mapped.
 * @returns The mapped DTO object.
 */
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

/**
 * Applies pagination to a query builder.
 * @template T - The type of the query builder.
 * @param {T} qb - The query builder to apply pagination to.
 * @param {number} page - The page number.
 * @param {number} [pageSize=20] - The number of items per page.
 * @returns {T} - The modified query builder with pagination applied.
 */
function withPagination<T extends PgSelect>(
  qb: T,
  page: number,
  pageSize: number = 20
) {
  return qb.limit(pageSize).offset(page * pageSize);
}

/**
 * Adds relational joins to the provided query builder.
 * @param qb The query builder to add the joins to.
 * @returns The query builder with the added joins.
 */
function withRelations<T extends PgSelectQueryBuilder>(qb: T) {
  if (!user) {
    return qb;
  }
  return qb
    .leftJoin(links, eq(transactions.link_id, links.id))
    .leftJoin(assets, eq(links.asset_id, assets.id))
    .leftJoin(providers, eq(links.provider_id, providers.id))
    .where(eq(transactions.user_id, user.id)); // Limit to the current user's transactions
}

/**
 * Retrieves a query for fetching transactions from the database.
 * @returns {Query} The query object for fetching transactions.
 */
function getQuery() {
  return db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.created_at))
    .$dynamic();
}

/**
 * Counts the number of transactions in the database.
 * @returns {Promise<number>} The count of transactions.
 */
function countTransactions() {
  return db.select({ count: sql<number>`COUNT(*)` }).from(transactions);
}

/**
 * Converts an array of rows into an array of TransactionDto objects.
 *
 * @param rows - The array of rows to be converted.
 * @returns An array of TransactionDto objects.
 */
function reduceRowsToDto(rows: any[]): TransactionDto[] {
  return rows.reduce((accArr, row) => {
    const txn = row.transactions;
    const asset = row.assets;
    const link = row.links;
    const provider = row.providers;

    const updatedAcc = { ...txn } as TransactionWithRelations;

    if (link) {
      updatedAcc.link = link;
    }

    if (asset) {
      updatedAcc.asset = asset;
    }

    if (provider) {
      updatedAcc.provider = provider;
    }

    accArr.push(updatedAcc);
    return accArr;
  }, [] as TransactionDto[]);
}

/**
 * Retrieves transactions by ticker.
 * @param page - The page number (optional, default is 0).
 * @param ticker - The ticker symbol of the asset.
 * @returns A promise that resolves to an object containing paginated results with total amount.
 */
export async function getTransactionsByTicker({
  page = 0,
  ticker,
}: {
  page?: number;
  ticker: string;
}): Promise<PaginatedResultsWithTotalAmount> {
  let query = getQuery();

  const asset = await getAssetByTicker(ticker);

  if (!asset) {
    return { data: [], count: 0, total_amount: 0 };
  }

  query = query.where(eq(links.asset_id, asset.id));

  const [rows, [{ count }], [{ total_amount }]] = await Promise.all([
    withPagination(withRelations(query), page),
    countTransactions(),
    getTransactionsAmountForAssetId(asset.id),
  ]);

  return { data: reduceRowsToDto(rows), count, total_amount };
}

/**
 * Retrieves the total amount of transactions for a given asset ID.
 * @param id - The asset ID.
 * @returns A promise that resolves to the total amount of transactions.
 */
async function getTransactionsAmountForAssetId(id: number) {
  const result = await db
    .select({
      total_amount: sql<number>`COALESCE(SUM(transactions.amount), 0)`,
    })
    .from(transactions)
    .leftJoin(links, eq(transactions.link_id, links.id))
    .where(eq(links.asset_id, id))
    .execute();

  return result;
}

/**
 * Retrieves transactions by provider.
 * @param {Object} options - The options for retrieving transactions.
 * @param {number} [options.page=0] - The page number of the transactions.
 * @param {string} options.slug - The slug of the provider.
 * @returns {Promise<PaginatedResults>} The paginated results of the transactions.
 */
export async function getTransactionsByProvider({
  page = 0,
  slug,
}: {
  page?: number;
  slug: string;
}): Promise<PaginatedResults> {
  let query = getQuery();

  const provider = await getProviderBySlug(slug);

  if (!provider) {
    return { data: [], count: 0 };
  }

  query = query.where(eq(links.provider_id, provider.id));

  const [rows, [{ count }]] = await Promise.all([
    withPagination(withRelations(query), page),
    countTransactions(),
  ]);

  return { data: reduceRowsToDto(rows), count };
}

/**
 * Retrieves a paginated list of transactions.
 *
 * @param page The page number to retrieve (default: 1).
 * @returns A promise that resolves to a PaginatedResults object containing the transaction data and total count.
 */
export async function getTransactions(page = 1): Promise<PaginatedResults> {
  let query = getQuery();

  const [rows, [{ count }]] = await Promise.all([
    withPagination(withRelations(query), page),
    countTransactions(),
  ]);

  return { data: reduceRowsToDto(rows), count };
}

/**
 * Retrieves a transaction by its ID.
 * @param transactionId - The ID of the transaction to retrieve.
 * @returns A Promise that resolves to a TransactionDto if the transaction is found, or undefined if not found.
 */
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
