import { db } from "@src/db";
import { eq, sql } from "drizzle-orm";

export const getMessagesByConversationIdCount = async (conversationId: string): Promise<number> => {
  try {
    const query = sql`
            SELECT COUNT(*) as total
            FROM messages m
            WHERE m.room_id = ${conversationId}
        `;
    const result = await db.execute(query);
    return parseInt(result.rows[0].total as string);
  } catch (error) {
    console.error("getMessagesByConversationIdCount error", error);
    throw error;
  }
}

export const getMessagesByConversationId = async (conversationId: string, limit: number = 20, offset: number = 0) => {
  try {
    const query = sql`
            SELECT 
                m.id,
                m.room_id,
                m.sender_id,
                m.content,
                m.sent_at,
                m.delivered_at,
                m.seen_at,
                u.username as sender_username,
                c.slug as room_id
            FROM messages m
            LEFT JOIN users u ON m.sender_id = u.id
            LEFT JOIN rooms c ON m.room_id = c.id
            WHERE m.room_id = ${conversationId}
            ORDER BY m.id DESC
            LIMIT ${limit}
            OFFSET ${offset}
        `;

    const countQuery = sql`
            SELECT COUNT(*) as total
            FROM messages m
            WHERE m.room_id = ${conversationId}
        `;

    const [messages] = await Promise.all([
      db.execute(query),
    ]);

    return messages.rows.reverse();

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
                m.sender_id,
                m.content,
                m.sent_at,
                m.delivered_at,
                m.seen_at,
                u.username as sender_username,
                r.slug as room_id
            FROM messages m
            LEFT JOIN users u ON m.sender_id = u.id
            LEFT JOIN rooms r ON m.room_id = r.id
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
