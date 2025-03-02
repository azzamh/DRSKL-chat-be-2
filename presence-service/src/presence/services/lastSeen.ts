import * as redis from '../../shared/redisAdapter';
import { IPubSubMQ, PubsubRedisMQ } from '../pubsubAdapter';
import * as dao from '../dao';

const pubSub: IPubSubMQ = new PubsubRedisMQ();


export async function getLastSeen(username: string): Promise<string> {
  const last_seen = await redis.getKey(`status:last_seen:username:${username}`)
  if(last_seen)
    return last_seen
  if (!last_seen) {
    const last_seen_db = (await dao.getUserLastSeen(username))?.last_seen
    if (last_seen_db) {
      return last_seen_db.toISOString()
    } 
  }
  return ""
}
