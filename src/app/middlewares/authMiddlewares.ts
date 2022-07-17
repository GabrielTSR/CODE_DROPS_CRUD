import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/User';
import { removeBearer, verifyToken } from '../utils/tokenProvider';

//Type of the incoming valid token
interface TokenPayload {
    user: User;
    iat: number;
    exp: number;
}

//This function is used to check if the user is authenticated
export function authUser(req: Request, res: Response, next: NextFunction) {
    //Getting the token from the request header
    const { authorization } = req.headers;

    //If the token is not present, return an error
    if (!authorization) {
        return res.status(401).json({ error: { message: 'Token not provided' } });
    }

    //Removing Bearer from the token
    const token = removeBearer({ token: authorization });
    try {
        //Verifying the token
        const data = verifyToken({ token });

        //Redeeming the token user through destructuring
        const { user } = data as TokenPayload;

        //returning the user to the request
        req.user = user;

        //Calling the next function
        return next();
    } catch {
        //If an error occurred, return error
        return res.sendStatus(401);
    }
}

//This function is used to check if the user can manipulate videos
export function canManipulateVideos(req: Request, res: Response, next: NextFunction) {
    //Getting the logged user from the request
    const { user } = req;

    //Getting the role from the user
    const { role } = user;

    //If the user can not manipulate videos, return an error
    if (!role.canManipulateVideos) {
        return res
            .status(401)
            .json({ error: { message: 'This user does not have permission to manipulate the requested item' } });
    }

    //Calling the next function
    return next();
}

//This function is used to check if the user can manipulate categories
export function canManipulateCategories(req: Request, res: Response, next: NextFunction) {
    //Getting the logged user from the request
    const { user } = req;

    //Getting the role from the user
    const { role } = user;

    //If the user can not manipulate categories, return an error
    if (!role.canManipulateCategories) {
        return res
            .status(401)
            .json({ error: { message: 'This user does not have permission to manipulate the requested item' } });
    }

    //Calling the next function
    return next();
}
