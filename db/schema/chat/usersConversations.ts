import { pgTable, primaryKey, integer, uuid } from 'drizzle-orm/pg-core';

export const usersRooms = pgTable('users_conversations', {
    user_id: uuid('user_id',).notNull(),
    room_id: integer('room_id').notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.user_id, table.room_id] })
}));

export type UsersConversations = typeof usersRooms.$inferSelect;
export type NewUsersConversations = typeof usersRooms.$inferInsert;