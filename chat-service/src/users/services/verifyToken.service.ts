import { InternalServerErrorResponse, UnauthorizedResponse } from "@src/shared/commons/patterns";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getUserById } from "../dao/get";

export const verifyTokenService = async (
    token: string
) => {
    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        const { id } = payload;

        const user = await getUserById(id);
        if (!user) {
            return new UnauthorizedResponse("Invalid token").generate();
        }

        return {
            data: {
                user,
            },
            status: 200
        }
    } catch (err: any) {
        return new UnauthorizedResponse("Invalid token").generate();
    }
}