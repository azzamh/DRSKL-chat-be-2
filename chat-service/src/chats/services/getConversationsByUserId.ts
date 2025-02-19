import * as dao from "@src/chats/dao/conversations/get";
import { InternalServerErrorResponse, OkResponse } from "@src/shared/commons/patterns";

export const getConversationsByUserId = async (userId: number) => {
  try{
    const res = await dao.getConversationsByUserId(userId);
    return new OkResponse(res).generate()
  } catch (err: any) {
    return new InternalServerErrorResponse(err).generate()
  }
}