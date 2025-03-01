import { pgTable, primaryKey, uuid, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').unique().primaryKey(),
    username: varchar('username', { length: 256 }).notNull().unique(),
    full_name: varchar('full_name', { length: 256 }),
}, (table) => ({
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;