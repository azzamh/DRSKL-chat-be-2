import { NewMessage } from "@db/schema/chat/messages";
import * as schema from '@db/schema/chat/messages';
import { db } from "@src/db";
import { eq, sql } from "drizzle-orm";

export const getMessagesByConversationId = async (conversationId: string) => {
  try {
    const query = sql`
            SELECT 
                m.id,
                m.conversation_id,
                m.sender_id,
                m.content,
                m.sent_at,
                m.delivered_at,
                m.seen_at,
                u.username as sender_username,
                c.slug as room_id
            FROM messages m
            LEFT JOIN users u ON m.sender_id = u.id
            LEFT JOIN conversations c ON m.conversation_id = c.id
            WHERE m.conversation_id = ${conversationId}
            ORDER BY m.id ASC
        `;

    const result = await db.execute(query);
    return result.rows;
  } catch (error) {
    console.error("getMessagesByConversationId error", error);
    throw error;
  }
}

export const getMessageById = async (messageId: number) => {
  try {
    const query = sql`
            SELECT 
                m.id,
                m.conversation_id,
                m.sender_id,
                m.content,
                m.sent_at,
                m.delivered_at,
                m.seen_at,
                u.username as sender_username
            FROM messages m
            LEFT JOIN users u ON m.sender_id = u.id
            WHERE m.id = ${messageId}
            LIMIT 1
        `;

    const result = await db.execute(query);
    return result.rows[0];
  } catch (error) {
    console.error("getMessageById error", error);
    throw error;
  }
}
