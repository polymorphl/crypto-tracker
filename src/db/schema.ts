import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});

export type Transaction = typeof transactions.$inferSelect;
