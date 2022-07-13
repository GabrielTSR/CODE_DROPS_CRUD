import { ErrorWithStats } from './../model/ErrorWithStats';
import { VideoService } from '../services/VideoService';
import { Request, Response } from 'express';

const videoService = new VideoService();

async function getAllVideos(req: Request, res: Response) {
    const result = await videoService.getAllVideos();

    if (result instanceof ErrorWithStats) return res.status(result.status).json({ error: { message: result.message } });

    return res.json(result);
}

async function createVideo(req: Request, res: Response) {
    const { name, description, id_category, duration, studios } = req.body;

    const result = await videoService.createVideo({ name, description, id_category, duration, studios });

    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    return res.status(201).json(result);
}

export { getAllVideos, createVideo };
