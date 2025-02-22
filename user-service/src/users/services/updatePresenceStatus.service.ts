import bcrypt from 'bcrypt'
import { NewUser } from '@db/schema/users/users';
import { updateUser } from '../dao/update';
import { InternalServerErrorResponse, CreatedResponse } from '@src/shared/commons/patterns';
import * as redis from '@src/shared/redisAdapter';

export const updatePresenceStatus = async (
    user_id: string,
    isOnline: boolean,
    lastactivity: Date = new Date(),
) => {
    try {
        const user = await updateUser({
            id: user_id,
            is_online: isOnline ? '1' : '0',
            last_online: lastactivity,
        })

        await redis.setKey(`user:full_user:${user_id}`, `${JSON.stringify(user)}`)

        return new CreatedResponse(user).generate()
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate();
    }
}