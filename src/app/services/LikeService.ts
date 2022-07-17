import { ErrorWithStats } from '../model/ErrorWithStats';
import {
    categoryRepository,
    likeRepository,
    userRepository,
    videoRepository,
} from '../entity/repositories/repositories';
import { Video } from '../entity/Video';
import { User } from '../entity/User';
import { Like } from '../entity/Like';

type getNumberOfLikesAndUsersParams = {
    videos: Video[];
};

interface Liker extends User {
    occourrences: number;
}

interface VideoWithLikerAndLikes extends Video {
    likes: number;
    likers: Liker[];
}

interface VideoWithOccours extends Video {
    occours: number;
}

//Defining all types used
type videosLikedByUserParams = {
    user: User;
};

type likeVideoParams = {
    user: User;
    id_video: number;
};

type deleteLikeParams = {
    user: User;
    id_video: number;
};

////Class used to handle the like service
export class LikeService {
    //This method is used to get the number of likes of a video, and the users who liked it
    async getNumberOfLikesAndUsers({
        videos,
    }: getNumberOfLikesAndUsersParams): Promise<VideoWithLikerAndLikes[] | ErrorWithStats> {
        try {
            //Array with the videos with the number of likes and the users who liked it
            const videosWithLikesAndLikers: VideoWithLikerAndLikes[] = [];

            //Iterating over the videos, to get the number of likes and the users who liked it, with the while operator
            while (videos.length) {
                //Getting the first video of the array
                const video = videos.shift();

                //Getting the number of likes of the video
                const likesQuantity = await likeRepository.count({ where: { id_video: video.id } });

                //Getting the users who liked the video, with no repetitions, and saying how many times they liked it
                const likes = await likeRepository.find({
                    where: { id_video: video.id },
                    order: { id_user: 'ASC' },
                });

                //Array with the users who liked the video, with no repetitions
                let idLikersArray: { id: number; occourrences: number }[] = [];

                //Iterating over the likers, to remove the repetitions and specify how many times they liked it
                likes.forEach((like) => {
                    //Checking if the user is already in the array
                    const idUser = idLikersArray.find((user) => user.id === like.id_user);

                    //If the user is not in the array, add him
                    if (!idUser) {
                        //@ts-ignore
                        idLikersArray.push({
                            id: like.id_user,
                            occourrences: 1,
                        });
                    } else {
                        //If the user is in the array, increase his occourrences
                        idUser.occourrences++;
                    }
                });

                //**(*%&¨&%&56) */
                const idUserArrayWithNoOccours = idLikersArray.map((liker) => {
                    const likerWithNoOccours = { id: liker.id };

                    return likerWithNoOccours;
                });

                //Getting the users from the database
                const users = await userRepository.find({
                    //@ts-ignore
                    where: [idUserArrayWithNoOccours],
                    order: { id: 'ASC' },
                });

                //Complete type of liker with occours
                const likersWithOccours: Liker[] = [];

                //Iterating over users, to add the occurrences to each liker
                users.forEach((user, index): void => {
                    //Adding the liker to the array, with the number of occurrences
                    //@ts-ignore
                    likersWithOccours.push({ ...user, occourrences: idLikersArray[index].occourrences });
                });

                //Adding the video to the array, with the number of likes and the users who liked it
                videosWithLikesAndLikers.push({
                    ...video,
                    likes: likesQuantity,
                    likers: likersWithOccours,
                });
            }

            //Returning the videos with the number of likes and the users who liked it
            return videosWithLikesAndLikers;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 502);
        }
    } //Function

    //This method is used to get videos liked by me
    async videosLikedByUser({ user }: videosLikedByUserParams): Promise<VideoWithOccours[] | ErrorWithStats> {
        try {
            //Getting the likes of the user
            const likes = await likeRepository.find({ where: { id_user: user.id }, order: { id_video: 'ASC' } });

            //Checking if some like exists
            if (!likes.length) {
                return new ErrorWithStats('You did not like any videos', 404);
            }

            //Iterating, and saving the repeated id of liked videos in an Array
            const repeatedIdVideoArray = likes.map((like): { id: number } => {
                return { id: like.id_video };
            });

            //Array with no repeated id
            let idVideoArray: { id: number; occurrences: number }[] = [];

            //Iterating over repeatedIdVideoArray, to remove the repetitions but specify how many times there were each occurrence
            repeatedIdVideoArray.forEach((like): void => {
                //Checking if the video is already in the array
                const indexFoundVideo = idVideoArray.findIndex((video): boolean => {
                    return video.id === like.id;
                });

                //If the id is not in the array, add it
                if (indexFoundVideo <= -1) {
                    //Adding the video to the array
                    idVideoArray.push({ id: like.id, occurrences: 1 });
                } else {
                    //Incrementing the number of occurrences of the video
                    idVideoArray[indexFoundVideo].occurrences++;
                }
            });

            const idVideoArrayWithNoOccours = idVideoArray.map((video) => {
                const videoWithNoOccours = { id: video.id };

                return videoWithNoOccours;
            });

            //Getting the videos from the database
            const videos = await videoRepository.find({
                //@ts-ignore
                where: [idVideoArrayWithNoOccours],
                relations: ['category'],
                order: { id: 'ASC' },
            });

            //Complete type of video with occours
            const videosWithOccours: VideoWithOccours[] = [];

            //Iterating over videos, to add the occurrences to each video
            videos.forEach((video, index): void => {
                //Adding the video to the array, with the number of occurrences
                videosWithOccours.push({
                    ...video,
                    occours: idVideoArray[index].occurrences,
                });
            });

            return videosWithOccours;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 502);
        }
    }

    //This method is used to like a video
    async likeVideo({ id_video, user }: likeVideoParams): Promise<Like | ErrorWithStats> {
        try {
            //Checking if the video referenced by the like exists
            const video = await videoRepository.findOne({ where: { id: id_video } });

            //If the category does not exist, return an error
            if (!video) {
                return new ErrorWithStats('Video does not exists', 404);
            }

            //Creating the like instance
            const like = likeRepository.create({ id_video, id_user: user.id });

            //Saving the like to database
            await likeRepository.save(like);

            //Returning the like
            return like;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 502);
        }
    }

    //This method is used to delete the first like of a video
    async deleteLike({ id_video, user }: deleteLikeParams): Promise<void | ErrorWithStats> {
        try {
            //Checking if the video referenced by the like exists
            const video = await videoRepository.findOne({ where: { id: id_video } });

            //If the category does not exist, return an error
            if (!video) {
                return new ErrorWithStats('Video does not exists', 404);
            }

            //Getting the first like of the video
            const like = await likeRepository.findOne({ where: { id_video, id_user: user.id }, order: { id: 'ASC' } });

            //If the like does not exist, return an error
            if (!like) {
                return new ErrorWithStats('Like does not exists', 404);
            }

            //Deleting the like from database
            await likeRepository.remove(like);

            return;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 502);
        }
    }
}
