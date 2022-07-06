import { ErrorWithStats } from '../model/ErrorWithStats';
import { UserService } from './../../services/UserService';
import { Request, Response } from 'express';
import { AuthService } from '../../services/AuthService';

const authService = new AuthService();

export async function authenticate(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await authService.authenticate({ email, password });

    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    return res.json(result);
}
