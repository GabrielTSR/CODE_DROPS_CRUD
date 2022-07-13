import { Token } from '../Token';
import { AppDataSource } from '../../../data-source';
import { Category } from '../Category';
import { User } from '../User';
import { Video } from '../Video';
import { Role } from '../Role';
import { Studio } from '../Studio';
import { City } from '../City';

const categoryRepository = AppDataSource.getRepository(Category);
const videoRepository = AppDataSource.getRepository(Video);
const userRepository = AppDataSource.getRepository(User);
const tokenRepository = AppDataSource.getRepository(Token);
const roleRepository = AppDataSource.getRepository(Role);
const studioRepository = AppDataSource.getRepository(Studio);
const cityRepository = AppDataSource.getRepository(City);

//Exporting the repositorys
export {
    categoryRepository,
    videoRepository,
    userRepository,
    tokenRepository,
    roleRepository,
    studioRepository,
    cityRepository,
};
