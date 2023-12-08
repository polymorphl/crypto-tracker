import 'server-only';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { Asset, Link, assets, links } from '@/db/schema';

export type LinkDto = {
  id: number;
  type: 'cold-wallet' | 'platform' | 'wallet';
  asset_slug: string;
  asset_id: number;
  provider_id: number;
  user_id: string;
  url: string | null;
};

export type CreateLinkDto = {
  name: string;
  type: 'cold-wallet' | 'platform' | 'wallet';
  asset_slug: string;
  asset_id: number;
  provider_id: number;
  user_id: string;
  url?: string | null;
};

/**
 * Maps a Link object to a DTO (Data Transfer Object).
 * @param item The Link object to be mapped.
 * @returns The mapped DTO object.
 */
function toDtoMapper(item: Link) {
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

export async function getLinks(userId: string): Promise<LinkDto[]> {
  const rows = await db.query.links.findMany({
    where: eq(links.user_id, userId),
  });

  return rows.map(toDtoMapper);
}
