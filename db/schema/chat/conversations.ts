import { is } from 'drizzle-orm';
import { pgTable, boolean, varchar, primaryKey, serial } from 'drizzle-orm/pg-core';

export const rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  is_group: boolean('is_group').default(false),
}, (table) => ({
  // pk: primaryKey({ columns: [ table.id] })
}));

export type Rooms = typeof rooms.$inferSelect;
export type NewRooms = typeof rooms.$inferInsert;