import * as redis from '../../shared/redisAdapter';
import { IPubSubMQ, PubsubRedisMQ } from '../pubsubAdapter';
import * as dao from '../dao';
import { InternalServerErrorResponse, OkResponse } from "@src/shared/commons/patterns";

const pubSub: IPubSubMQ = new PubsubRedisMQ();

export async function getOnlineStatus(username: string) {
  try{
    let isOnline =  await redis.getKey(`status:online:username:${username}`)
    return new OkResponse({ is_online: isOnline === 'true' }).generate()
  } catch (err: any) {
    return new InternalServerErrorResponse(err).generate()
  }
}

export async function setOnlineStatus(userId: string, username: string, status: boolean) {
  try{
    const last_seen = new Date();
    await redis.setKey(`status:online:username:${username}`, `${status}`)
    await redis.setKey(`status:last_seen:username:${username}`, last_seen.toISOString())
    dao.upsertUserLastSeen(userId, last_seen);
    await pubSub.publishOnlineStatus(userId, status)
    return new OkResponse({status: 'success'}).generate()
  } catch (err: any) {
    // console.error('setOnlineStatus error:', err);
    return new InternalServerErrorResponse(err).generate()
  }
}
