import * as dao from "@src/chats/dao";
import { InternalServerErrorResponse, BadRequestResponse, OkResponse } from "@src/shared/commons/patterns";
import { count } from "console";
import { v4 as uuidv4 } from 'uuid';

export const getMessageById = async (messageId: number) => {
    try {
        const res = await dao.getMessageById(messageId);
        return new OkResponse(res).generate()
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate()
    }
}

export const getMessagesByConversationSlug = async (slug: string, page: number = 1, limit: number = 20) => {
    try {
        const conversationId = await dao.getConversationIdBySlug(slug);
        const offset = (page - 1) * limit;
        const res = await dao.getMessagesByConversationId(conversationId, limit, offset);
        const total = await dao.getMessagesByConversationIdCount(conversationId);
        return new OkResponse({
            messages: res,
            pagination: {
                page,
                limit,
                count: res.length,
                total_count: total,
                total_pages: Math.ceil(total / limit)
            }
        }).generate()
    }
    catch (err: any) {
        return new InternalServerErrorResponse(err).generate()
    }
}

export const getMessagesByConversation = async (roomId: string) => {
    try {
        const res = await dao.getMessagesByConversationId(roomId);
        // console.log('res', res)
        return new OkResponse(res).generate()
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate()
    }
}

export const sendMessage = async (user_id: string, conversationSlug: string, message: string, test_id?: string) => {
    try {
        const conversationId = await dao.getConversationIdBySlug(conversationSlug);
        // const user = await dao.getUserByUsername(username);
        const res = await dao.insertNewMessage({
            sender_id: user_id,
            conversation_id: conversationId,
            content: message,
            delivered_at: new Date(),
            test_id: test_id ? test_id : uuidv4()
        });
        return new OkResponse(res).generate()
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate()
    }
}