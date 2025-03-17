import * as redis from '../../shared/redisAdapter';
import { IPubSubMQ, PubsubRedisMQ } from '../../shared/pubsubAdapter';
import { InternalServerErrorResponse, OkResponse } from "@src/shared/commons/patterns";

const pubSub: IPubSubMQ = new PubsubRedisMQ();

export async function getTypingStatus(username: string) {
  try {
    let isTyping = await redis.getKey(`status:typing:username:${username}`)
    return new OkResponse({ is_typing: isTyping === 'true' }).generate()
  } catch (err: any) {
    return new InternalServerErrorResponse(err).generate()
  }
}

export async function setTypingStatus(userId: string, username: string, status: boolean) {
  try {
    await redis.setKey(`status:typing:username:${username}`, `${status}`, 10)
    await pubSub.publishTypingStatus(username, status)
    return new OkResponse({ status: 'success' }).generate()
  } catch (err: any) {
    return new InternalServerErrorResponse(err).generate()
  }
}
