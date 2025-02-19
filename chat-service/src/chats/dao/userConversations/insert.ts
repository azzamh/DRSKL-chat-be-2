import { NewUsersConversations } from "@db/schema/chat/usersConversations";
import * as schema from '@db/schema/chat/usersConversations';
import { db } from "@src/db";

export const insertUserConversations = async (data: NewUsersConversations) => {
    console.log("insertUserConversations data", data);
    const result = await db
        .insert(schema.usersConversations)
        .values(data)
        .onConflictDoNothing()
        .returning({
            user_id: schema.usersConversations.user_id,
            conversation_id: schema.usersConversations.conversation_id,
        });
    return result;
}
