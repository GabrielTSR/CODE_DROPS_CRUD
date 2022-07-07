import { TokenService } from './../services/TokenService';
import { ErrorWithStats } from '../model/ErrorWithStats';
import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();
const tokenService = new TokenService();

export async function authenticate(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await authService.authenticate({ email, password });

    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    //Saving the token in the database
    await tokenService.save({ hash: result.token, idUser: result.user.id });

    return res.json(result);
}

export async function refresh(req: Request, res: Response) {
    const { authorization } = req.headers;

    const result = await authService.refresh({ token: authorization });

    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    //Saving the token in the database
    await tokenService.save({ hash: result.token, idUser: result.user.id });

    return res.json(result);
}
