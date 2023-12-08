import 'server-only';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { Asset, assets } from '@/db/schema';

export type AssetDto = {
  id: number;
  name: string;
  ticker: string;
  type: 'crypto' | 'fiat';
  amount: string;
  price: string;
  icon: string | null;
};

export type CreateAssetDto = {
  name: string;
  ticker: string;
  type: 'crypto' | 'fiat';
  amount: string;
  price: string;
  icon: string | null;
};

/**
 * Maps an Asset object to a DTO (Data Transfer Object).
 * @param item - The Asset object to be mapped.
 * @returns The DTO object with the mapped properties.
 */
function toDtoMapper(item: Asset) {
  return {
    id: item.id,
    name: item.name,
    ticker: item.ticker,
    type: item.type,
    amount: item.amount,
    price: item.price,
    icon: item.icon,
  };
}

/**
 * Retrieves assets from the database.
 * @returns A promise that resolves to an array of AssetDto objects.
 */
export async function getAssets(): Promise<AssetDto[]> {
  const rows = await db.query.assets.findMany();

  return rows.map(toDtoMapper);
}

/**
 * Retrieves an asset by its ID.
 * @param id - The ID of the asset.
 * @returns A promise that resolves to the asset DTO if found, or undefined if not found.
 */
export async function getAssetById(id: number): Promise<AssetDto | undefined> {
  const foundAsset = await db.query.assets.findFirst({
    where: eq(assets.id, id),
  });

  if (!foundAsset) {
    return undefined;
  }

  return toDtoMapper(foundAsset);
}

/**
 * Retrieves an asset by its ticker.
 * @param ticker - The ticker symbol of the asset.
 * @returns A promise that resolves to an AssetDto if the asset is found, otherwise undefined.
 */
export async function getAssetByTicker(
  ticker: string
): Promise<AssetDto | undefined> {
  const foundAsset = await db.query.assets.findFirst({
    where: eq(assets.ticker, ticker.toUpperCase()),
  });

  if (!foundAsset) {
    return undefined;
  }

  return toDtoMapper(foundAsset);
}

export async function createAsset(asset: CreateAssetDto) {
  await db.insert(assets).values(asset);
}
