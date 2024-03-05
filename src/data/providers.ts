import 'server-only';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { Provider, providers } from '@/db/schema';
import { LinkDto, getCurrentUserLinks } from './link';

export type ProviderDto = {
  id: number;
  name: string;
  slug: string;
  type: 'cold-wallet' | 'hot-wallet';
  icon: string | null;
};

/**
 * Maps a Provider object to a DTO (Data Transfer Object).
 * @param item - The Provider object to be mapped.
 * @returns The mapped DTO object.
 */
function toDtoMapper(item: Provider) {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    type: item.type,
    icon: item.icon,
  };
}

/**
 * Retrieves a list of providers.
 * @returns A promise that resolves to an array of ProviderDto objects.
 */
export async function getProviders({ page = 0 }): Promise<ProviderDto[]> {
  const rows = await getCurrentUserLinks(page, {
    withRelations: { provider: { all: true } },
  });

  return rows.data.map((r: LinkDto) => r.provider);
}

/**
 * Retrieves a provider by its ID.
 * @param id The ID of the provider to retrieve.
 * @returns A Promise that resolves to a ProviderDto if the provider is found, otherwise undefined.
 */
export async function getProviderById(
  id: number
): Promise<ProviderDto | undefined> {
  const foundProvider = await db.query.providers.findFirst({
    where: eq(providers.id, id),
  });

  if (!foundProvider) {
    return undefined;
  }

  return toDtoMapper(foundProvider);
}

/**
 * Retrieves a provider by its slug.
 * @param slug - The slug of the provider.
 * @returns A Promise that resolves to a ProviderDto if found, otherwise undefined.
 */
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
