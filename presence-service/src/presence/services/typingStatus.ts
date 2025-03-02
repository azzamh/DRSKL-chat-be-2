import * as redis from '../../shared/redisAdapter';
import { IPubSubMQ, PubsubRedisMQ } from '../pubsubAdapter';

const pubSub: IPubSubMQ = new PubsubRedisMQ();

export async function getTypingStatus(username: string): Promise<boolean> {
  let isTyping =  await redis.getKey(`status:typing:username:${username}`)
  return isTyping === 'true'
}

export async function setTypingStatus(userId: string, username: string, status: boolean): Promise<void> {
  await redis.setKey(`status:typing:username:${username}`, `${status}`)
  await pubSub.publishTypingStatus(username, status)
}
