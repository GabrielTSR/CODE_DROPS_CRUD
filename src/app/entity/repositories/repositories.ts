import { Token } from '../Token';
import { AppDataSource } from '../../../data-source';
import { Category } from '../Category';
import { User } from '../User';
import { Video } from '../Video';
import { Role } from '../Role';
import { Studio } from '../Studio';
import { City } from '../City';
import { Like } from '../Like';

//Instantiating the used repositories, and exporting them
export const categoryRepository = AppDataSource.getRepository(Category);
export const videoRepository = AppDataSource.getRepository(Video);
export const tokenRepository = AppDataSource.getRepository(Token);
export const roleRepository = AppDataSource.getRepository(Role);
export const studioRepository = AppDataSource.getRepository(Studio);
export const cityRepository = AppDataSource.getRepository(City);
export const likeRepository = AppDataSource.getRepository(Like);
export const userRepository = AppDataSource.getRepository(User);
