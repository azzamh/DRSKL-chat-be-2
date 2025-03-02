import * as redis from '../../shared/redisAdapter';
import { IPubSubMQ, PubsubRedisMQ } from '../pubsubAdapter';
import * as dao from '../dao';
import { InternalServerErrorResponse, OkResponse } from "@src/shared/commons/patterns";

const pubSub: IPubSubMQ = new PubsubRedisMQ();


export async function getLastSeen(username: string){
  try{
    const last_seen = await redis.getKey(`status:last_seen:username:${username}`)
    if(last_seen)
      return new OkResponse({last_seen: last_seen}).generate()
    if (!last_seen) {
      const last_seen_db = (await dao.getUserLastSeen(username))?.last_seen
      if (last_seen_db) {
        return new OkResponse({last_seen:last_seen_db.toISOString()}).generate()
      } 
    }
    return new OkResponse({last_seen: undefined}).generate()
  } catch (err: any) {
    return new InternalServerErrorResponse(err).generate()
  }
}