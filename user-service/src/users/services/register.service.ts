import bcrypt from 'bcrypt'
import { NewUser } from '@db/schema/user/users';
import { insertNewUser } from '../dao/insert';
import { InternalServerErrorResponse, CreatedResponse, BadRequestResponse } from '@src/shared/commons/patterns';
import { addOrUpdateUser } from '@src/chat/client';
import { db } from '@src/db';

export const registerService = async (
    username: string,
    password: string,
    full_name: string,
) => {
    try {
        return await db.transaction(async (trx) => {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const userData: NewUser = {
                username,
                password: hashedPassword,
                full_name,
            };

            // Insert new user using transaction
            const newUser = await insertNewUser(userData, trx);

            if (!newUser || newUser.length === 0) {
                throw new Error('Failed to insert user');
            }

            // Add user to chat service
            await addOrUpdateUser(newUser[0].id, username, newUser[0].full_name || '');

            // Commit implicitly if no error occurs
            return new CreatedResponse(newUser).generate();
        });
    } catch (err: any) {
        if (err.code === '23505') {
            return new BadRequestResponse('Username already exists').generate();
        } 
        return new InternalServerErrorResponse(err.message || 'Internal server error').generate();
    }
}