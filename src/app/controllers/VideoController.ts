import { ErrorWithStats } from './../model/ErrorWithStats';
import { VideoService } from '../../services/VideoService';
import { Request, Response } from 'express';

const videoService = new VideoService();

async function getAllVideos(req: Request, res: Response) {
    const videos = await videoService.getAllVideos();

    return res.json(videos);
}

async function createVideo(req: Request, res: Response) {
    const { name, description, id_category, duration } = req.body;

    const result = await videoService.createVideo({ name, description, id_category, duration });

    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    return res.status(201).json(result);
}

export { getAllVideos, createVideo };
