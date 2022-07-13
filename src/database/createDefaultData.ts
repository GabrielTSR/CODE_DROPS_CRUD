import { cityRepository, roleRepository, studioRepository } from '../app/entity/repositorys/repositorys';

export async function createDefaultData() {
    await roleRepository.save([
        {
            id: 1,
            name: 'common',
            canManipulateVideos: true,
            canManipulateCategories: false,
        },
        {
            id: 2,
            name: 'admin',
            canManipulateVideos: true,
            canManipulateCategories: true,
        },
    ]);

    await cityRepository.save([
        {
            id: 1,
            name: 'Caracas',
        },
        {
            id: 2,
            name: 'NY',
        },
    ]);

    await studioRepository.save([
        {
            id: 1,
            name: 'Marvel Studios',
            id_city: 1,
        },
        {
            id: 2,
            name: 'DC Studios',
            id_city: 2,
        },
    ]);
}
