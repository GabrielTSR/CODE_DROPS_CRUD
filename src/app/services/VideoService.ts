import { ErrorWithStats } from '../model/ErrorWithStats';
import { categoryRepository, videoRepository } from '../entity/repositories/repositories';
import { Video } from '../entity/Video';
import { Studio } from '../entity/Studio';

//Defining all types used
type VideoRequest = {
    name: string;
    description: string;
    duration: number;
    id_category: number;
    studios: Studio[];
};

////Class used to handle the video service
export class VideoService {
    //This method is used to get all videos
    async getAllVideos() {
        try {
            //Collecting all videos
            const videos = await videoRepository.find({
                relations: ['category', 'studios', 'studios.city'],
            });

            //If there are no videos, return an error
            if (videos.length < 1) return new ErrorWithStats('No videos found!', 404);

            //Returning all videos
            return videos;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }

    //This method is used to create a new video
    async createVideo({
        name,
        description,
        duration,
        id_category,
        studios,
    }: VideoRequest): Promise<Video | ErrorWithStats> {
        try {
            //Checking if the category referenced by the video exists
            const category = await categoryRepository.findOne({ where: { id: id_category } });

            //If the category does not exist, return an error
            if (!category) {
                return new ErrorWithStats('Category does not exists', 404);
            }

            //Creating the video instance
            const video = videoRepository.create({ name, description, duration, id_category, studios });

            //Saving the video to database
            await videoRepository.save(video);

            //Returning the video
            return video;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }
}
