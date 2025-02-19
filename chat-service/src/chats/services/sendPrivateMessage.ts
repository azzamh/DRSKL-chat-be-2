import { db } from "@src/db";
import { getConversationById, getPrivateConversationByUserIds } from "../dao/conversations/get";
import { insertNewMessage } from "../dao/mesages/insert";
import { gePeerIdByConversationId } from "../dao/conversations/get";
import { InternalServerErrorResponse, CreatedResponse, NotFoundResponse } from "@src/shared/commons/patterns";
import { startPrivateConversation } from "./startPrivateConversation";
import * as redis from '@src/shared/redisAdapter'
import { getUserById } from "@src/users/dao/get";

export const sendPrivateMessage = async (sender_id: string, conversation_id: string, message: string) => {

    try {
        const result = await db.transaction(async (tx) => {
            let conversation = await getConversationById(Number(conversation_id));

            if (!conversation) {
                return new NotFoundResponse('Conversation not found').generate()
            }

            const newMessage = await insertNewMessage( {
                sender_id: sender_id,
                conversation_id: conversation.id,
                content: message,
            });

            const receiver_id = await gePeerIdByConversationId(conversation.id, sender_id);


            if (newMessage) {
                const pubsubPrivateMessageData = {
                  senderId: sender_id,
                  recipientId: receiver_id,
                  messageId: newMessage.id,
                }
                redis.publishMessage(`send_messages:${receiver_id}`, JSON.stringify(pubsubPrivateMessageData))
            }

            const user = await getUserById(sender_id);

            const resp = {
                id: newMessage.id,
                user_id: sender_id,
                username: user.username,
                conversation_id: conversation.id,
                full_name: user.full_name,
                content: newMessage.content,
                delivered_at: newMessage.delivered_at,
            }

            return new CreatedResponse(resp).generate();
            
        });

        return result;
    } catch (err) {
        return new InternalServerErrorResponse(err).generate()
    }
}