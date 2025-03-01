import { pgTable, primaryKey, integer , uuid} from 'drizzle-orm/pg-core';

export const usersConversations = pgTable('users_conversations', {
    user_id: uuid('user_id', ).notNull(),
    conversation_id: integer('conversation_id').notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [ table.user_id, table.conversation_id] })
}));

export type UsersConversations = typeof usersConversations.$inferSelect;
export type NewUsersConversations = typeof usersConversations.$inferInsert;