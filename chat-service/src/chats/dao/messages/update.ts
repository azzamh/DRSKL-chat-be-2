import * as schema from '@db/schema/chat/messages';
import { db } from "@src/db";
import { sql } from "drizzle-orm";

interface UpdateMessageContentParams {
  id: number;
  content: string;
}

interface UpdateMessageStatusParams {
  id: number;
  delivered_at?: Date;
  seen_at?: Date;
}

export const updateMessageContent = async (params: UpdateMessageContentParams) => {
  try {
    const query = sql`
            UPDATE messages
            SET content = ${params.content}
            WHERE id = ${params.id}
            RETURNING 
                id,
                room_id,
                sender_id,
                content,
                sent_at,
                delivered_at,
                seen_at
        `;

    const result = await db.execute(query);
    return result.rows[0];
  } catch (error) {
    console.error("updateMessageContent error", error);
    throw error;
  }
}

export const updateMessageStatus = async (params: UpdateMessageStatusParams) => {
  try {
    let updateFields = [];
    let values = [];

    if (params.delivered_at) {
      updateFields.push('delivered_at = $1');
      values.push(params.delivered_at);
    }
    if (params.seen_at) {
      updateFields.push(`seen_at = $${values.length + 1}`);
      values.push(params.seen_at);
    }

    const query = sql`
            UPDATE messages
            SET ${sql.raw(updateFields.join(', '))}
            WHERE id = ${params.id}
            RETURNING 
                id,
                room_id,
                sender_id,
                content,
                sent_at,
                delivered_at,
                seen_at
        `;

    const result = await db.execute(query);
    return result.rows[0];
  } catch (error) {
    console.error("updateMessageStatus error", error);
    throw error;
  }
}
