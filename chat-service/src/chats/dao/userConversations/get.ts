import * as schema from '@db/schema/chat/usersConversations';
import { db } from "@src/db";
import { eq } from "drizzle-orm";

export const getUserConversations = async (userId: number) => {
    const result = await db
        .select()
        .from(schema.usersConversations)
        .where(eq(schema.usersConversations.user_id, userId.toString()))
    return result;
}

export const getUserConversationsByConversationId = async (conversationId: number) => {
    const result = await db
        .select()
        .from(schema.usersConversations)
        .where(eq(schema.usersConversations.conversation_id, conversationId))
    return result;
}
