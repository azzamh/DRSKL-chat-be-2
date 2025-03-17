import { pgTable, primaryKey, uuid, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const userStatuses = pgTable('users_status', {
  user_id: uuid('id').unique(),
  username: varchar('username').unique().notNull(),
  last_seen: timestamp('last_seen', { withTimezone: true }),
}, (table) => ({
  pk: primaryKey({ columns: [table.user_id] })
}));

export type UserStatus = typeof userStatuses.$inferSelect;
export type NewUserStatus = typeof userStatuses.$inferInsert;