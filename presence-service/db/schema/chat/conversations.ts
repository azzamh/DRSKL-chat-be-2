import { is } from 'drizzle-orm';
import { pgTable, boolean, varchar, primaryKey, serial } from 'drizzle-orm/pg-core';

export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  is_group: boolean('is_group').default(false),
}, (table) => ({
  // pk: primaryKey({ columns: [ table.id] })
}));

export type Conversations = typeof conversations.$inferSelect;
export type NewConversations = typeof conversations.$inferInsert;