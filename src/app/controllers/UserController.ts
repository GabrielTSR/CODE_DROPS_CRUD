import { ErrorWithStats } from '../model/ErrorWithStats';
import { UserService } from '../services/UserService';
import { Request, Response } from 'express';

//Instantiating the services used
const userService = new UserService();

//This function is used to create an user
export async function store(req: Request, res: Response) {
    //Getting the data from the request body
    const { email, password, userName } = req.body;

    //Using the UserService to create an user
    const result = await userService.createUser({ email, password, userName });

    //If an error occurred, return it
    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    //Returning the result
    return res.status(201).json(result);
}
