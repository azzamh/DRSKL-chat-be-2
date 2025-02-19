import { db } from "@src/db";
import { insertNewConversations } from "../dao/conversations/insert";
import { NewConversations } from "@db/schema/chat/conversations";
import { insertUserConversations } from "../dao/userConversations/insert";
import { getUserByUsername } from "@src/users/dao/get";
import { NotFoundResponse } from "@src/shared/commons/patterns";
import { getPrivateConversationByUserIds } from "@src/chats/dao/conversations/get";
import { InternalServerErrorResponse, OkResponse } from "@src/shared/commons/patterns";

export const startPrivateConversation = async (userId: string, peerUsername: string) => {
    try {
        const result = await db.transaction(async (tx) => {

            //check peer username
            const peerUser = await getUserByUsername(peerUsername);
            if (!peerUser || !peerUser.id) {
                return new NotFoundResponse('User not found').generate()
            }

            //check conversation exist
            // console.log('peerUsername', peerUsername)
            // console.log('userId', userId)
            // console.log('peerUser.id', peerUser.id)
            const existingConversation = await getPrivateConversationByUserIds(userId, peerUser.id.toString());

            // console.log('existingConversation', existingConversation)
            if (existingConversation) {
                return new OkResponse(existingConversation).generate();
            }

            const conversationData: NewConversations = {
                name: 'private',
                is_group: false,
            };

            const newConversation = await insertNewConversations(conversationData);
            // console.log('newConversation', newConversation)
            await insertUserConversations({
                user_id: userId,
                conversation_id: newConversation.id,
            });

            await insertUserConversations({
                user_id: peerUser.id,
                conversation_id: newConversation.id,
            });

            return new OkResponse(newConversation).generate()

        });

        return result;
    } catch (err) {
        return new InternalServerErrorResponse(err).generate()
    }
}
