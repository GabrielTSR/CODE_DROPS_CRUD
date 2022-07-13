import { NextFunction, Request, Response } from 'express';

export default function videoPermission(req: Request, res: Response, next: NextFunction) {
    const { user } = req;
    const { role } = user;

    if (!role.canManipulateVideos) {
        return res
            .status(401)
            .json({ error: { message: 'This user does not have permission to manipulate the requested item' } });
    }

    return next();
}
