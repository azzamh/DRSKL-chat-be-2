import { NewMessage } from "@db/schema/chat/messages";
import * as schema from '@db/schema/chat/messages';
import { generateId } from "@src/chats/utils/idGen";
import { db } from "@src/db";

export const insertNewMessage = async (data: NewMessage) => {
    // console.log("insertNewMessage data", data);
    // console.log("insertNewMessage db", db);
    const global_id = generateId();
    console.log("insertNewMessage global_id", global_id);
    const result = await db
        .insert(schema.messages)
        .values(data)
        .returning({
            id: schema.messages.id,
            room_id: schema.messages.room_id,
            sender_id: schema.messages.sender_id,
            content: schema.messages.content,
            sent_at: schema.messages.sent_at,
            delivered_at: schema.messages.delivered_at,
            seen_at: schema.messages.seen_at,
        });
    // console.log("insertNewMessage result", result);
    return result[0];
}