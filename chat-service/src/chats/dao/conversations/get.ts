import * as schema from '@db/schema';
import { db } from "@src/db";
import { OkResponse } from '@src/shared/commons/patterns';
import { ok } from 'assert';
import { eq, or, and, ne, sql } from "drizzle-orm";

export const getConversationById = async (conversationId: number) => {
    try {
        const result = await db
          .select({
              id: schema.conversations.id,
              name: schema.conversations.name,
              is_group: schema.conversations.is_group,
          })
          .from(schema.conversations)
          .where(
              eq(schema.conversations.id, conversationId)
          ).execute();
        return result[0];
    } catch (error) {
        console.error("getConversationById error", error);
        throw error;
    }
}

export const getConversationsByUserId = async (userId: number) => {
    try {
        const result = await db.execute(sql `
                SELECT
                    c.id AS id,
                    u2.full_name as name,
                    c.is_group
                FROM users_conversations uc
                JOIN conversations c
                    ON c.id = uc.conversation_id
                JOIN users_conversations uc2
                    ON uc2.conversation_id = c.id
                JOIN users u2
                    ON u2.id = uc2.user_id
                WHERE
                uc.user_id = ${userId.toString()}
                AND uc2.user_id <> ${userId.toString()}
                AND c.is_group = FALSE;
            ` );
        console.log("getConversationsByUserId", userId,result.rows);
        return result.rows;
    } catch (error) {
        console.error("getConversationsByUserId error", error);
        throw error;
    }
}

export const getPrivateConversationByUserIds = async (userId: string, peerUserId: string) => {
    try {
            const result = await db.execute(sql `
                SELECT 
                    c.id,
                    CASE 
                        WHEN c.is_group THEN c.name 
                        ELSE u.username 
                    END as name,
                    c.is_group
                FROM conversations c
                LEFT JOIN users_conversations uc ON c.id = uc.conversation_id
                LEFT JOIN users u ON u.id = uc.user_id
                WHERE uc.user_id != ${userId.toString()}
                    AND c.is_group = false 
                    AND uc.user_id = ${peerUserId.toString()} 
                ` );
                console.log("getPrivateConversationByUserIds", result.rows[0]);
        return result.rows[0];

    } catch (error) {
        console.error("getPrivateConversationByUserIds error", error);
        throw error;
    }
}

export const gePeerIdByConversationId = async (conversationId: number, userId: string) => {
    try {
        const result = await db.execute(sql `
            SELECT 
                u.id
            FROM conversations c
            LEFT JOIN users_conversations uc ON c.id = uc.conversation_id
            LEFT JOIN users u ON u.id = uc.user_id
            WHERE uc.user_id != ${userId.toString()} 
                AND c.id = ${conversationId.toString()}
            ` );

        return result.rows[0].id;
    } catch (error) {
        console.error("getConversationsByUserId error", error);
        throw error;
    }
}