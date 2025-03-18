import { pgTable, primaryKey, uuid, text, timestamp, varchar, serial, integer } from 'drizzle-orm/pg-core';
import { rooms } from './rooms';


export const messages = pgTable('messages', {
    id: varchar('id').notNull().primaryKey(),
    room_seq_id: integer('room_seq_id').default(0).notNull(),
    test_id: varchar('test_id').notNull().unique(),
    room_id: uuid('room_id').notNull().references(() => rooms.id),
    sender_id: uuid('sender_id').notNull(),
    content: varchar('content', { length: 256 }).notNull(),
    sent_at: timestamp('sent_at', { withTimezone: true }).defaultNow(),
    delivered_at: timestamp('delivered_at', { withTimezone: true }),
    seen_at: timestamp('seen_at', { withTimezone: true }),
}, (table) => ({
    // pk: primaryKey({ columns: [ table.id] })
}));

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;


