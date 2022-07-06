import { ErrorWithStats } from '../app/model/ErrorWithStats';
import { categoryRepository, videoRepository } from '../app/entity/repositorys/repositorys';
import { Video } from '../app/entity/Video';

type VideoRequest = {
    name: string;
    description: string;
    duration: number;
    id_category: number;
};

export class VideoService {
    async getAllVideos() {
        try {
            const videos = await videoRepository.find({
                relations: ['category'],
            });

            return videos;
        } catch (error) {
            return new ErrorWithStats(error.message, 400);
        }
    }

    async createVideo({ name, description, duration, id_category }: VideoRequest): Promise<Video | ErrorWithStats> {
        try {
            if (!categoryRepository.findOne({ where: { id: id_category } })) {
                return new ErrorWithStats('Category does not exists', 404);
            }

            const video = videoRepository.create({ name, description, duration, id_category });

            await videoRepository.save(video);

            return video;
        } catch (error) {
            return new ErrorWithStats(error.message, 400);
        }
    }
}
