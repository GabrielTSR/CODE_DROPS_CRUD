import { ErrorWithStats } from '../model/ErrorWithStats';
import { Request, Response } from 'express';
import { LikeService } from '../services/LikeService';
import { isIdValid } from '../utils/validation/isIdValid';

//Instantiating the services used
const likeService = new LikeService();

//This function is used to see videos liked by me
export async function videosLikedByMe(req: Request, res: Response) {
    //Getting the logged user in the request
    const { user } = req;

    //Getting the videos liked by the user
    const videos = await likeService.videosLikedByUser({ user });

    //If an error occurs, return it
    if (videos instanceof ErrorWithStats) {
        return res.status(videos.status).json(videos);
    }

    //Returning the videos liked by the user
    return res.status(200).json(videos);
}

//This function is used to like a video, with repeated calls, the user can like a video multiple times
export async function likeVideo(req: Request, res: Response) {
    //Getting the video id from the request params
    const { id_video } = req.params;

    //Getting the logged user in the request
    const { user } = req;

    //Checking if the id is a number
    if (!isIdValid(id_video)) return res.status(400).json({ error: { message: 'Invalid video id' } });

    //Using likeService to like a video
    const result = await likeService.likeVideo({ id_video: Number(id_video), user });

    //If an error occurred, return it
    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    //Returning the result
    return res.status(201).json(result);
}

//This function is used to delete the first like of a video, with repeated calls, the user can delete the first like multiple times
export async function deleteLike(req: Request, res: Response) {
    //Getting the video id from the request params
    const { id_video } = req.params;

    //Getting the logged user in the request
    const { user } = req;

    //Checking if the id is a number
    if (!isIdValid(id_video)) return res.status(400).json({ error: { message: 'Invalid video id' } });

    //Using likeService to delete the first like of a video
    const result = await likeService.deleteLike({ id_video: Number(id_video), user });

    //If an error occurred, return it
    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    //Returning the result
    return res.status(204).end();
}
