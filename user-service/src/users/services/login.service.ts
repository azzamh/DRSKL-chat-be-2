import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByUsername } from '../dao/get';

import { InternalServerErrorResponse, NotFoundResponse, OkResponse } from "@src/shared/commons/patterns"
import { User } from '@db/schema/user/users';

export const loginService = async (
    username: string,
    password: string
) => {
    try {
        const user: User = await getUserByUsername(
            username
        );
        if (!user) {
            return new NotFoundResponse("User not found").generate();
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return new NotFoundResponse("Invalid password").generate();
        }

        const payload = {
            id: user.id,
            username: user.username,
        }
        const secret: string = process.env.JWT_SECRET as string;
        const token = jwt.sign(payload, secret, {
            expiresIn: "1d",
        })

        return new OkResponse({token}).generate()
    } catch (err: any) {
        return new InternalServerErrorResponse(err).generate();
    }
}