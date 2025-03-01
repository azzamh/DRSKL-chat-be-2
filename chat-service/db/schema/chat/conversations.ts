import { sql } from 'drizzle-orm';
import { pgTable, boolean, varchar, timestamp, serial, uuid } from 'drizzle-orm/pg-core';

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar('slug', { length: 256 }).notNull().unique(),
  name: varchar('name', { length: 256 }).notNull(),
  is_deleted: boolean('is_deleted').default(false).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Conversations = typeof conversations.$inferSelect;
export type NewConversations = typeof conversations.$inferInsert;