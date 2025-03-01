import { pgTable, primaryKey, uuid, text, timestamp, varchar, serial, integer } from 'drizzle-orm/pg-core';
import { conversations } from './conversations';

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    test_id: varchar('test_id').notNull().unique(),
    conversation_id: uuid('conversation_id').notNull().references(() => conversations.id),
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


