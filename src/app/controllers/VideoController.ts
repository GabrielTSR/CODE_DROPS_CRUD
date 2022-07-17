import { ErrorWithStats } from './../model/ErrorWithStats';
import { VideoService } from '../services/VideoService';
import { Request, Response } from 'express';

//Instantiating the services used
const videoService = new VideoService();

//This function is used to get all the videos
export async function getAllVideos(req: Request, res: Response) {
    //Using VideoService to get all the videos
    const result = await videoService.getAllVideos();

    //If an error occurred, return it
    if (result instanceof ErrorWithStats) return res.status(result.status).json({ error: { message: result.message } });

    //Returning the videos to the user
    return res.json(result);
}

//This function is used to create a new video
export async function createVideo(req: Request, res: Response) {
    //Getting the data from the request body
    const { name, description, id_category, duration, studios } = req.body;

    //USing VideoService to create a new video
    const result = await videoService.createVideo({ name, description, id_category, duration, studios });

    //If an error occurred, return it
    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    //Returning the result
    return res.status(201).json(result);
}
