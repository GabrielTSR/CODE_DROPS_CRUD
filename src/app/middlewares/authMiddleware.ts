import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/User';
import { removeBearer, verifyToken } from '../utils/tokenProvider';

interface TokenPayload {
    user: User;
    iat: number;
    exp: number;
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: { message: 'Token not provided' } });
    }

    //Removing Bearer from the token
    const token = removeBearer({ token: authorization });
    try {
        const data = verifyToken({ token });
        const { user } = data as TokenPayload;
        req.user = user;

        return next();
    } catch {
        return res.sendStatus(401);
    }
}
