import { sql } from 'drizzle-orm';
import {
  decimal,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id')
    .notNull()
    .primaryKey()
    .$defaultFn(() => sql`(gen_random_uuid())`),
  email: varchar('email', { length: 256 }).notNull().unique(),
  emailVerified: timestamp('emailVerified', {
    withTimezone: true,
  }).defaultNow(),
  password: varchar('password', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type User = typeof users.$inferSelect;

// BUSINESS

export const assets = pgTable('assets', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  ticker: varchar('ticker', { length: 256 }).notNull(),
  type: text('type', { enum: ['crypto', 'fiat'] }).notNull(),
  amount: decimal('amount', { precision: 20, scale: 8 }).notNull().default('0'),
  price: decimal('price', { precision: 20, scale: 8 }).notNull().default('0'),
  icon: varchar('icon', { length: 256 }),
});

export type Asset = typeof assets.$inferSelect;

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  type: text('type', { enum: ['cold-wallet', 'platform', 'wallet'] }).notNull(),
  asset_slug: varchar('asset_slug', { length: 256 }).notNull(),
  asset_id: integer('asset_id')
    .references(() => assets.id)
    .notNull(),
  provider_id: integer('provider_id')
    .references(() => providers.id)
    .notNull(),
  user_id: varchar('user_id', { length: 256 }).notNull(),
  url: varchar('url', { length: 256 }),
});

export type Link = typeof links.$inferSelect;

export const providers = pgTable('providers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  slug: varchar('slug', { length: 256 }).notNull(),
  type: text('type', { enum: ['cold-wallet', 'hot-wallet'] }).notNull(),
  icon: varchar('icon', { length: 256 }),
});

export type Provider = typeof providers.$inferSelect;

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  link_id: integer('link_id')
    .references(() => links.id)
    .notNull(),
  user_id: varchar('user_id', { length: 256 }).notNull(),
  type: text('type', {
    enum: ['buy', 'deposit', 'sell', 'withdrawal'],
  }).notNull(),
  amount: decimal('amount', { precision: 20, scale: 8 }).notNull(),
  price_per_unit: decimal('price_per_unit').notNull(),
  note: varchar('name', { length: 256 }),
  linked_url: varchar('linked_url', { length: 256 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type Transaction = typeof transactions.$inferSelect;

export const raw_imports = pgTable('raw_imports', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 256 }).notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  type: varchar('type', { length: 256 }).notNull(),
  path: varchar('path', { length: 256 }).notNull(),
  size: integer('size').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type RawImports = typeof raw_imports.$inferSelect;
