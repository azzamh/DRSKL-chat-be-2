export * from './get';
export * from './insert';
export * from './update';

import { db } from "@src/db";
import { messages } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const getMessagesByConversationId = async (conversationId: string, limit: number = 20, offset: number = 0) => {
  try {
    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.conversation_id, conversationId))
      .orderBy(desc(messages.id))
      .limit(limit)
      .offset(offset);

    return result;
  } catch (error) {
    console.error("getMessagesByConversationId error", error);
    throw error;
  }
}