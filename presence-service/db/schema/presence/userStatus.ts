import { pgTable, primaryKey, uuid, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const user_statuses = pgTable('users', {
  user_id: uuid('id').unique(),
  last_seen: timestamp('last_seen', { withTimezone: true }),
  is_online: text('is_online').default('false'),
  is_typing: text('is_typing').default('false'),
}, (table) => ({
  pk: primaryKey({ columns: [table.user_id] })
}));

export type UserStatus = typeof user_statuses.$inferSelect;
export type NewUserStatus = typeof user_statuses.$inferInsert;