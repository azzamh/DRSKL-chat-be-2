import { pgTable, primaryKey, integer , uuid} from 'drizzle-orm/pg-core';

export const usersRooms = pgTable('users_rooms', {
    user_id: uuid('user_id', ).notNull(),
    room_id: uuid('room_id').notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [ table.user_id, table.room_id] })
}));

export type usersRooms = typeof usersRooms.$inferSelect;
export type NewUsersRooms = typeof usersRooms.$inferInsert;