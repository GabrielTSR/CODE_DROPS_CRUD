import { Token } from './../Token';
import { AppDataSource } from '../../../data-source';
import { Category } from '../Category';
import { User } from '../User';
import { Video } from '../Video';

const categoryRepository = AppDataSource.getRepository(Category);
const videoRepository = AppDataSource.getRepository(Video);
const userRepository = AppDataSource.getRepository(User);
const tokenRepository = AppDataSource.getRepository(Token);

//Exporting the repositorys
export { categoryRepository, videoRepository, userRepository, tokenRepository };
