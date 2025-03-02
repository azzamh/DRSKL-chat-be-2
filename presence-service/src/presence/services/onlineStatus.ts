import * as redis from '../../shared/redisAdapter';
import { IPubSubMQ, PubsubRedisMQ } from '../pubsubAdapter';
import * as dao from '../dao';

const pubSub: IPubSubMQ = new PubsubRedisMQ();

export async function getOnlineStatus(username: string): Promise<boolean> {
  let isOnline =  await redis.getKey(`status:online:username:${username}`)
  return isOnline === 'true'
}

export async function setOnlineStatus(userId: string, username: string, status: boolean): Promise<void> {
  const last_seen = new Date();
  await redis.setKey(`status:online:username:${username}`, `${status}`)
  await redis.setKey(`status:last_seen:username:${username}`, last_seen.toISOString())
  dao.upsertUserLastSeen(userId, last_seen);
  await pubSub.publishOnlineStatus(userId, status)
}
