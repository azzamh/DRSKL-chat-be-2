import { pgTable, primaryKey, uuid, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().unique().primaryKey(),
    username: varchar('username', { length: 256 }).notNull().unique(),
    password: varchar('password', { length: 256 }).notNull(),
    full_name: varchar('full_name', { length: 256 }),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
    // pk: primaryKey({ columns: [ table.username]})
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;