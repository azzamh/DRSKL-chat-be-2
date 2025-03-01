import * as dao from "@src/chats/dao";
import { InternalServerErrorResponse, OkResponse } from "@src/shared/commons/patterns";

export const getRoomsByUserName = async (userName: string) => {
  try {
    const conversations = await dao.getConversationsByUsername(userName);
    return new OkResponse({
      conversations,
      count: conversations.length
    }).generate();
  } catch (err: any) {
    console.error('getRoomsByUserName error:', err);
    return new InternalServerErrorResponse(err).generate();
  }
}

export const getRoomBySlug = async (slug: string) => {
  try {
    const conversation = await dao.getConversationIdBySlug(slug);
    return new OkResponse(conversation).generate();
  } catch (err: any) {
    console.error('getRoomById error:', err);
    return new InternalServerErrorResponse(err).generate();
  }
}

export const createRoomWithParticipants = async (name: string, slug: string, usernames: string[]) => {
  try {
    const participantIds = await dao.getUserIdsByUsernames(usernames);
    const conversation = await dao.createNewConversation({name, slug}, participantIds);

    return new OkResponse({
      conversation,
      participantCount: participantIds.length
    }).generate();
  } catch (err: any) {
    console.error('createRoom error:', err);
    return new InternalServerErrorResponse(err).generate();
  }
}

export const updateRoom = async (roomId: number, name: string) => {
  try {
    const c = await dao.updateConversation({
      id: roomId, 
      name,
    });
    return new OkResponse(c).generate();
  } catch (err: any) {
    console.error('updateRoom error:', err);
    return new InternalServerErrorResponse(err).generate();
  }
}

export const deleteRoom = async (slug: string) => {
  try {
    await dao.deleteConversation(slug);
    return new OkResponse({}).generate();
  } catch (err: any) {
    console.error('deleteRoom error:', err);
    return new InternalServerErrorResponse(err).generate();
  }
}

export const joinRoom = async (slug: string, username: string) => {
  try {
    const userIds = await dao.getUserIdsByUsernames([username]);
    await dao.addUsersToConversation(slug, userIds);
    return new OkResponse({}).generate();
  } catch (err: any) {
    console.error('joinRoom error:', err);
    return new InternalServerErrorResponse(err).generate();
  }
}

export const createRoom = async (slug: string, name: string, username: string) => {
  try {
    const participantIds = await dao.getUserIdsByUsernames([username]);
    const conversation = await dao.createNewConversation({name, slug}, participantIds);

    return new OkResponse({
      conversation,
      participantCount: participantIds.length
    }).generate();
  } catch (err: any) {
    console.error('createRoom error:', err);
    return new InternalServerErrorResponse(err).generate();
  }
}