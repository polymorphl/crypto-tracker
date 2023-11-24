import {
  decimal,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

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

export const providers = pgTable('providers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  type: text('type', { enum: ['cold-wallet', 'hot-wallet'] }).notNull(),
});

export type Provider = typeof providers.$inferSelect;

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  asset_id: integer('asset_id')
    .references(() => assets.id)
    .notNull(),
  provider_id: integer('provider_id')
    .references(() => providers.id)
    .notNull(),
  type: text('type', {
    enum: ['buy', 'deposit', 'sell', 'withdrawal'],
  }).notNull(),
  amount: decimal('amount', { precision: 20, scale: 8 }).notNull(),
  price_per_unit_usd: decimal('price_per_unit').notNull(),
  note: varchar('name', { length: 256 }),
  linked_url: varchar('linked_url', { length: 256 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type Transaction = typeof transactions.$inferSelect;
