import { NewConversations } from "@db/schema/chat/conversations";
import * as schema from '@db/schema/chat/conversations';
import { db } from "@src/db";

export const insertNewConversations = async (data: NewConversations) => {
    // console.log("insertNewConversations data", data);
    // console.log("insertNewConversations db", db);
    const result = await db
        .insert(schema.conversations)
        .values(data)
        .onConflictDoNothing()
        .returning({
            id: schema.conversations.id,
            name: schema.conversations.name,
            is_group: schema.conversations.is_group,
        });
    // console.log("insertNewConversations result", result);
    return result[0];
}
