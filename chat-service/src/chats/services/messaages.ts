import * as chatDao from "@src/chats/dao";
import * as roomDao from "@src/chats/dao/rooms";
import { InternalServerErrorResponse, CreatedResponse, OkResponse } from "@src/shared/commons/patterns";
import { count } from "console";
import { v4 as uuidv4 } from 'uuid';
import pubsubMQ from '@src/shared/pubsubAdapter/PubsubRedisMQ'
import { generateId } from "../utils/idGen";

export const getMessageById = async (messageId: string) => {
    try {
        const res = await chatDao.getMessageById(messageId);
        return new OkResponse(res).generate()
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate()
    }
}

export const getMessagesByConversationSlug = async (slug: string, page: number = 1, limit: number = 20) => {
    try {
        const conversationId = await chatDao.getConversationIdBySlug(slug);
        const offset = (page - 1) * limit;
        const res = await chatDao.getMessagesByConversationId(conversationId, limit, offset);
        const total = await chatDao.getMessagesByConversationIdCount(conversationId);
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
        const res = await chatDao.getMessagesByConversationId(roomId);
        // console.log('res', res)
        return new OkResponse(res).generate()
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate()
    }
}

export const sendMessage = async (user_id: string, conversationSlug: string, message: string, test_id?: string) => {
    try {
        const user = await chatDao.getUserById(user_id);
        const conversationId = await chatDao.getConversationIdBySlug(conversationSlug);
        const roomSeqId = await roomDao.incrementRoomSeqId(conversationId);
        const global_id = generateId();
        console.log("insertNewMessage global_id", global_id);
        const newMessage = await chatDao.insertNewMessage({
            id: global_id,
            room_seq_id: roomSeqId,
            sender_id: user_id,
            room_id: conversationId,
            content: message,
            delivered_at: new Date(),
            test_id: test_id ? test_id : uuidv4()
        });
        const m = await chatDao.getMessageById(newMessage.id);

        let recipientIdList = await roomDao.getRoomParticipants(conversationId);

        recipientIdList = recipientIdList.filter(participant => participant.id !== user_id);

        recipientIdList.forEach(async (participant) => {
            console.log('====================>>>>>>>publishMessagesInbox:', participant.username, newMessage.id);
            pubsubMQ.publishMessagesInbox(participant.username, {
                id: newMessage.id,
                room_seq_id: m.room_seq_id as number,
                room_id: m.room_id as string,
                sender_id: user_id,
                content: message,
                sent_at: newMessage.sent_at,
                delivered_at: newMessage.delivered_at,
                seen_at: newMessage.seen_at,
                sender_username: m.sender_username as string
            });
        });

        console.log('====================>>>>>>>publishMessagesOutbox:', user.username, newMessage.id);
        pubsubMQ.publishMessagesOutbox(user.username, {
            id: newMessage.id,
            room_seq_id: m.room_seq_id as number,
            room_id: m.room_id as string,
            sender_id: user_id,
            content: message,
            sent_at: newMessage.sent_at,
            delivered_at: newMessage.delivered_at,
            seen_at: newMessage.seen_at,
            sender_username: m.sender_username as string
        });
        

        return new CreatedResponse({
            ...m
        }).generate()
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate()
    }
}