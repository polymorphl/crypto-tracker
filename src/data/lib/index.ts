import { PgSelect } from 'drizzle-orm/pg-core';

/**
 * Applies pagination to a query builder.
 * @template T - The type of the query builder.
 * @param {T} qb - The query builder to apply pagination to.
 * @param {number} page - The page number.
 * @param {number} [pageSize=20] - The number of items per page.
 * @returns {T} - The modified query builder with pagination applied.
 */
export function withPagination<T extends PgSelect>(
  qb: T,
  page: number,
  pageSize: number = 20
) {
  return qb.limit(pageSize).offset(page * pageSize);
}
