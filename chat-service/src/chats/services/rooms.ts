import * as dao from "@src/chats/dao";
import { InternalServerErrorResponse, OkResponse, ConflictResponse } from "@src/shared/commons/patterns";

export const getRoomsByUserName = async (userName: string, page: number = 1, limit: number = 20) => {
  try {
    const offset = (page - 1) * limit;
    const rooms = await dao.getConversationsByUsername(userName, limit, offset);
    const total = await dao.getConversationsByUsernameCount(userName);

    return new OkResponse({
      rooms,
      pagination: {
        page,
        limit,
        count: rooms.length,
        total_count: total,
        total_pages: Math.ceil(total / limit)
      },
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
    const conversation = await dao.createNewConversation({ name, slug }, participantIds);

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
    // console.log('>>>>>>>>joinRoom1', slug, username);
    const userIds = await dao.getUserIdsByUsernames([username]);
    // console.log('>>>>>>>>joinRoom2', userIds);
    let room_slug
    try {
      room_slug = await dao.getConversationIdBySlug(slug);
    }
    catch (err: any) {
      console.error('getConversationIdBySlug error:', err);
    }
    // console.log('>>>>>>>>joinRoom3', room_slug);
    if (!room_slug) {
      await createRoom(slug, slug, username);
    }else{
      await dao.addUsersToConversation(slug, userIds);
    }
    return new OkResponse({status: 'success'}).generate();
  } catch (err: any) {
    console.error('joinRoom error:', err);
    return new InternalServerErrorResponse(err).generate();
  }
}

export const createRoom = async (slug: string, name: string, username: string) => {
  try {
    const participantIds = await dao.getUserIdsByUsernames([username]);
    const conversation = await dao.createNewConversation({ name, slug }, participantIds);

    return new OkResponse({
      conversation,
      participantCount: participantIds.length
    }).generate();
  } catch (err: any) {
    if (err.code === '23505') {
      return new ConflictResponse('Room already exists').generate();
    }
    console.error('createRoom error:', err);
    return new InternalServerErrorResponse(err).generate();
  }
}

export const getRoomParticipants = async (conversationId: string) => {
  const participants = await dao.getRoomParticipants(conversationId);
  return new OkResponse(participants).generate();
}