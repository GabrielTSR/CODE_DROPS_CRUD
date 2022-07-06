import { ErrorWithStats } from '../model/ErrorWithStats';
import { UserService } from './../../services/UserService';
import { Request, Response } from 'express';

const userService = new UserService();

export async function store(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await userService.createUser({ email, password });

    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    return res.status(201).json(result);
}
