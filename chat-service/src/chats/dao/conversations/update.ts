import * as schema from '@db/schema/chat/conversations';
import { db } from "@src/db";
import { eq } from "drizzle-orm";

export const updateConversations = async (id: number, data: Partial<typeof schema.conversations.$inferInsert>) => {
    try {
        const result = await db
            .update(schema.conversations)
            .set(data)
            .where(eq(schema.conversations.id, id))
            .returning({
                id: schema.conversations.id,
                name: schema.conversations.name,
                is_group: schema.conversations.is_group,
            });
        // console.log("updateConversations result", result);
        return result;
    } catch (error) {
        console.error("updateConversations error", error);
        throw error;
    }
}
