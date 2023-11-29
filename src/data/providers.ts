import 'server-only';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { Provider, providers } from '@/db/schema';

export type ProviderDto = {
  id: number;
  name: string;
  slug: string;
  type: 'cold-wallet' | 'hot-wallet';
  icon: string | null;
};

export type CreateProviderDto = {
  name: string;
  slug: string;
  type: 'cold-wallet' | 'hot-wallet';
  icon: string | null;
};

export type ProviderId = number;

function toDtoMapper(item: Provider) {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    type: item.type,
    icon: item.icon,
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

export async function getProviderBySlug(
  slug: string
): Promise<ProviderDto | undefined> {
  const foundProvider = await db.query.providers.findFirst({
    where: eq(providers.slug, slug),
  });

  if (!foundProvider) {
    return undefined;
  }

  return toDtoMapper(foundProvider);
}

export async function createProvider(provider: CreateProviderDto) {
  await db.insert(providers).values(provider);
}
