import { ErrorWithStats } from './../app/model/ErrorWithStats';
import { Category } from './../app/entity/Category';
import { categoryRepository } from '../app/entity/repositorys/repositorys';

type createCategoryRequest = {
    name: string;
    description: string;
};

type updateCategoryRequest = {
    id: number;
    name: string;
    description: string;
};

export class CategoryService {
    async getAllCategories() {
        try {
            const categories = categoryRepository.find();

            return categories;
        } catch (error) {
            return new ErrorWithStats(error.message, 500);
        }
    }

    async createCategory({ name, description }: createCategoryRequest): Promise<Category | ErrorWithStats> {
        try {
            //"SELECT * FROM category WHERE name = '${name}' LIMIT 1"";
            if (await categoryRepository.findOne({ where: { name } })) {
                return new ErrorWithStats('Category already exists', 409);
            }

            const category = categoryRepository.create({ name, description });

            await categoryRepository.save(category);

            return category;
        } catch (error) {
            return new ErrorWithStats(error.message, 400);
        }
    }

    async updateCategory({ id, name, description }: updateCategoryRequest) {
        try {
            const category = await categoryRepository.findOne({ where: { id } });

            if (!category) {
                return new ErrorWithStats('Category does not exists!', 404);
            }

            category.name = name ? name : category.name;
            category.description = description ? description : category.description;

            await categoryRepository.save(category);

            return category;
        } catch (error) {
            return new ErrorWithStats(error.message, 400);
        }
    }

    async deleteCategory(id: number) {
        try {
            if (!(await categoryRepository.findOne({ where: { id } }))) {
                throw new ErrorWithStats('Category does not exists!', 404);
            }

            await categoryRepository.delete(id);
        } catch (error) {
            return new ErrorWithStats(error.message, 400);
        }
    }
}
