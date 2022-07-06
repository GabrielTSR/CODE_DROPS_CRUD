import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface TokenPayload {
    id: number;
    iat: number;
    exp: number;
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: { message: 'Token not provided' } });
    }

    //Removing Bearer from the token
    const token = authorization.replace('Bearer ', '').trim();
    try {
        const data = verify(token, process.env.JWT_SECRET);
        const { id } = data as TokenPayload;
        req.idUser = id;

        return next();
    } catch {
        return res.sendStatus(401);
    }
}
