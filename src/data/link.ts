import 'server-only';

import { and, desc, eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import {
  Asset,
  Link,
  Provider,
  Transaction,
  assets,
  links,
  providers,
} from '@/db/schema';
import { PgSelectQueryBuilder } from 'drizzle-orm/pg-core';
import { withPagination } from './lib';
import { currentUser } from '@clerk/nextjs';

export type LinkDto = {
  id: number;
  type: 'cold-wallet' | 'platform' | 'wallet';
  asset_slug: string;
  asset_id: number;
  provider_id: number;
  user_id: string;
  url: string | null;
  file?: string;
  asset?: Asset;
  provider?: Provider;
  transaction?: Transaction;
};

type LinkWithRelations = Link & {
  asset: Asset;
  provider: Provider;
  transaction?: Transaction;
};

/**
 * Maps the common properties of a link object.
 *
 * @param link - The link object to map.
 * @returns An object containing the common properties of the link.
 */
function mapCommonProperties(link: Link | Partial<LinkWithRelations>) {
  return {
    id: link.id,
    type: link.type,
    asset_slug: link.asset_slug,
    asset_id: link.asset_id,
    provider_id: link.provider_id,
    user_id: link.user_id,
    url: link.url,
  };
}

/**
 * Maps a Link object to a DTO (Data Transfer Object).
 * @param item The Link object to be mapped.
 * @returns The mapped DTO object.
 */
function toDtoMapper(item: Link | Partial<LinkWithRelations>) {
  if ('asset' in item && 'provider' in item) {
    const linkWithRelations = item as LinkWithRelations;
    const commonProperties = mapCommonProperties(linkWithRelations);
    return {
      ...commonProperties,
      asset: linkWithRelations.asset,
      provider: linkWithRelations.provider,
    };
  } else {
    return {
      id: item.id,
      type: item.type,
      asset_slug: item.asset_slug,
      asset_id: item.asset_id,
      provider_id: item.provider_id,
      user_id: item.user_id,
      url: item.url,
    };
  }
}

/**
 * Adds relational joins to the provided query builder.
 * @param qb The query builder to add the joins to.
 * @returns The query builder with the added joins.
 */
function withRelations<T extends PgSelectQueryBuilder>(qb: T) {
  return qb
    .leftJoin(assets, eq(links.asset_id, assets.id))
    .leftJoin(providers, eq(links.provider_id, providers.id));
}

/**
 * Retrieves a query for fetching links from the database.
 * @returns {Query} The query object for fetching links.
 */
function getQuery() {
  return db.select().from(links).orderBy(desc(links.id)).$dynamic();
}

/**
 * Counts the number of links in the database.
 * @returns {Promise<number>} The count of links.
 */
function countLinks(user_id: string) {
  return db
    .select({ count: sql<number>`COUNT(*)` })
    .from(links)
    .where(eq(links.user_id, user_id));
}

/**
 * Converts an array of rows into an array of LinkDto objects.
 *
 * @param rows - The array of rows to be converted.
 * @returns An array of LinkDto objects.
 */
function reduceRowsToDto(rows: any[]): LinkDto[] {
  return rows.reduce((accArr, row) => {
    const link = row.links;
    const asset = row.assets;
    const provider = row.providers;
    const transaction = row.transactions;

    const updatedAcc = { ...link } as LinkWithRelations;

    if (asset) {
      updatedAcc.asset = asset;
    }

    if (provider) {
      updatedAcc.provider = provider;
    }

    if (transaction) {
      updatedAcc.transaction = transaction;
    }

    accArr.push(updatedAcc);
    return accArr;
  }, [] as LinkDto[]);
}

type getCurrentUserLinksOptions = {
  withRelations?: {
    asset?: { id?: null | number; ticker?: null | string; all?: boolean };
    provider?: { id?: null | number; all?: boolean };
  };
};

export async function getCurrentUserLinks(
  page = 0,
  options: getCurrentUserLinksOptions = {
    withRelations: {
      asset: { id: null, ticker: null, all: false },
      provider: { id: null, all: false },
    },
  }
): Promise<any> {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not found');
  }
  let query: any = undefined;
  // Add relational joins to the query.
  query = db;
  if (options.withRelations?.asset) {
    // if (options.withRelations?.asset?.ticker) {
    if (options.withRelations?.asset?.ticker) {
      query = db
        .select()
        .from(links)
        .orderBy(
          desc(
            options.withRelations?.asset ? links.asset_slug : links.provider_id
          )
        )
        .where(
          and(
            eq(links.user_id, user.id),
            eq(links.asset_slug, options.withRelations?.asset?.ticker)
          )
        )
        .$dynamic();
    } else {
      query = db
        .selectDistinctOn([
          options.withRelations?.asset ? links.asset_slug : links.provider_id,
        ])
        .from(links)
        .orderBy(
          desc(
            options.withRelations?.asset ? links.asset_slug : links.provider_id
          )
        )
        .where(eq(links.user_id, user.id))
        .$dynamic();
    }
  } else if (options.withRelations?.provider) {
    if (options.withRelations?.provider?.id) {
    } else {
      query = db
        .selectDistinctOn([links.provider_id])
        .from(links)
        .orderBy(desc(links.provider_id))
        .where(eq(links.user_id, user.id))
        .$dynamic();
    }
  }

  const [rows, [{ count }]] = await Promise.all([
    withPagination(withRelations(query), page),
    countLinks(user.id),
  ]);
  const res = { data: reduceRowsToDto(rows), count };
  // console.log({ unit: res.data[0] });
  return res;
}

export async function createLinks(
  records: any[],
  provider: Provider
): Promise<any> {
  const user = await currentUser();
  if (!user) {
    throw new Error('User not found');
  }
  const newLinks = records.map((record) => {
    const newLink = {
      type: 'platform',
      asset_slug: record.asset_slug,
      asset_id: record.asset_id,
      provider_id: provider.id,
      user_id: user.id,
    } as Link;
    return newLink;
  });
  console.log({ countNewLinks: newLinks.length });
  const result = await db.insert(links).values(newLinks);
  return result;
}
