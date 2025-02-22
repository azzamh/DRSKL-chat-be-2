import { InternalServerErrorResponse, NotFoundResponse, OkResponse } from "@src/shared/commons/patterns"
import * as dao from "../dao/get"
import * as redis from '@src/shared/redisAdapter'

export const getUserByUsername = async (username: string) => {
    try {

      let userId =  await redis.getKey(`user:username_to_id:${username}`)

      if (!userId) {
        const user = await dao.getUserByUsername(username)
        await redis.setKey(`user:username_to_id:${username}`, `${user.id}`)
        userId = user.id
      }

        // Try to get from cache first
        const cachedUser = await redis.getKey(`user:full_user:${userId}`)
        if (cachedUser) {
            // console.log('User found in redis cache')
            return new OkResponse(JSON.parse(cachedUser)).generate()
        }

        // If not in cache, get from database
        const user = await dao.getUserById(userId!)
        if (!user) {
            return new NotFoundResponse('User not found').generate()
        }

        // Store in cache for future requests
        await redis.setKey(`user:full_user:${userId}`, `${JSON.stringify(user)}`) // expires in 1 hour
        return new OkResponse(user).generate()

    } catch (err: any) {
        console.error('Error in getUserInfoService:', err)
        return new InternalServerErrorResponse(err).generate()
    }
}