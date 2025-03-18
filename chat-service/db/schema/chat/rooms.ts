import { sql } from 'drizzle-orm';
import { pgTable, boolean, varchar, timestamp, uuid, integer } from 'drizzle-orm/pg-core';

export const rooms = pgTable('rooms', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar('slug', { length: 256 }).notNull().unique(),
  name: varchar('name', { length: 256 }).notNull(),
  is_deleted: boolean('is_deleted').default(false).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  last_seq_id: integer('last_seq_id').default(0).notNull(),
});

export type Rooms = typeof rooms.$inferSelect;
export type NewRooms = typeof rooms.$inferInsert;