import 'server-only';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { Provider, providers } from '@/db/schema';

export type ProviderDto = {
  id: number;
  name: string;
  type: 'cold-wallet' | 'hot-wallet';
};

export type CreateProviderDto = {
  name: string;
  type: 'cold-wallet' | 'hot-wallet';
};

export type ProviderId = number;

function toDtoMapper(item: Provider) {
  return {
    id: item.id,
    name: item.name,
    type: item.type,
  };
}

export async function getProviders(): Promise<ProviderDto[]> {
  const rows = await db.query.providers.findMany();

  return rows.map(toDtoMapper);
}

export async function getProviderById(
  providerId: number
): Promise<ProviderDto | undefined> {
  const foundProvider = await db.query.providers.findFirst({
    where: eq(providers.id, providerId),
  });

  if (!foundProvider) {
    return undefined;
  }

  return toDtoMapper(foundProvider);
}

export async function createProvider(provider: CreateProviderDto) {
  await db.insert(providers).values(provider);
}
