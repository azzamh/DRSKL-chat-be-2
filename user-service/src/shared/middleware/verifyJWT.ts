import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthenticatedResponse } from "../commons/patterns/exceptions";

interface JWTUser extends JwtPayload {
    id: string;
}

export const verifyJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            res.status(401).json(
                new UnauthenticatedResponse("No token provided").generate()
            );
            return;
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JWTUser;

        req.body.user = decoded;
        next();
    } catch (error) {
        res.status(401).json(
            new UnauthenticatedResponse("Invalid token").generate()
        );
        return;
    }
};