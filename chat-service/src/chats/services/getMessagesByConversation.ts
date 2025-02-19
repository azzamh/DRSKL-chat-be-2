import * as dao from "@src/chats/dao/mesages";
import { InternalServerErrorResponse, BadRequestResponse, OkResponse  } from "@src/shared/commons/patterns";

export const getMessagesByConversation = async (conversation_id: string) => {
    try{
        const cid = parseInt(conversation_id);
        // console.log('conversation_id', conversation_id)
        if (isNaN(cid)) {
            return new BadRequestResponse('Invalid conversation id').generate()
        }
        
        const res = await dao.getMessagesByConversationId(cid);
        // console.log('res', res)
        return new OkResponse(res).generate()
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate()
    }
}