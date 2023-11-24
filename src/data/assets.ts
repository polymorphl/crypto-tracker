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

export type AssetId = number;

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

export async function getAssets(): Promise<AssetDto[]> {
  const rows = await db.query.assets.findMany();

  return rows.map(toDtoMapper);
}

export async function getAssetById(
  assetId: number
): Promise<AssetDto | undefined> {
  const foundAsset = await db.query.assets.findFirst({
    where: eq(assets.id, assetId),
  });

  if (!foundAsset) {
    return undefined;
  }

  return toDtoMapper(foundAsset);
}

export async function getAssetByTicker(
  ticker: string
): Promise<AssetDto | undefined> {
  const foundAsset = await db.query.assets.findFirst({
    where: eq(assets.ticker, ticker),
  });

  if (!foundAsset) {
    return undefined;
  }

  return toDtoMapper(foundAsset);
}

export async function createAsset(asset: CreateAssetDto) {
  await db.insert(assets).values(asset);
}
