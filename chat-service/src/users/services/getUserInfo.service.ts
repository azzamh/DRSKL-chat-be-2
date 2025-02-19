import { InternalServerErrorResponse, NotFoundResponse, OkResponse } from "@src/shared/commons/patterns"
import { getUserById } from "../dao/get"
import * as redis from '@src/shared/redisAdapter'

export const getUserInfoService = async (user_id: string) => {
    try {
        // Try to get from cache first
        const cachedUser = await redis.getKey(`user:full_user:${user_id}`)
        if (cachedUser) {
            // console.log('User found in redis cache')
            return new OkResponse(JSON.parse(cachedUser)).generate()
        }

        // If not in cache, get from database
        const user = await getUserById(user_id)
        if (!user) {
            return new NotFoundResponse('User not found').generate()
        }

        // Store in cache for future requests
        await redis.setKey(`user:full_user:${user_id}`, `${JSON.stringify(user)}`) // expires in 1 hour
        return new OkResponse(user).generate()

    } catch (err: any) {
        console.error('Error in getUserInfoService:', err)
        return new InternalServerErrorResponse(err).generate()
    }
}

