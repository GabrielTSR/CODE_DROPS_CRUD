import { ErrorWithStats } from '../model/ErrorWithStats';
import { Category } from '../entity/Category';
import { categoryRepository } from '../entity/repositories/repositories';

//Defining all types used
type createCategoryRequest = {
    name: string;
    description: string;
};

type updateCategoryRequest = {
    id: number;
    name: string;
    description: string;
};

//Class used to handle the category service
export class CategoryService {
    //This method is used to get all categories
    async getAllCategories() {
        try {
            //Collecting all categories
            const categories = await categoryRepository.find();

            //If there are no categories, return an error
            if (categories.length < 1) return new ErrorWithStats('No categories found!', 404);

            //Returning all categories
            return categories;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 500);
        }
    }

    //This method is used to create a new category
    async createCategory({ name, description }: createCategoryRequest): Promise<Category | ErrorWithStats> {
        try {
            //Checking if the category already exists, if it does, return an error
            if (await categoryRepository.findOne({ where: { name } })) {
                return new ErrorWithStats('Category already exists', 409);
            }

            //Creating the category object
            const category = categoryRepository.create({ name, description });

            //Saving the category
            await categoryRepository.save(category);

            //Returning the category
            return category;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }

    //This method is used to update a category
    async updateCategory({ id, name, description }: updateCategoryRequest) {
        try {
            //Checking if the category exists
            const category = await categoryRepository.findOne({ where: { id } });

            //If the category does not exist, return an error
            if (!category) {
                return new ErrorWithStats('Category does not exists!', 404);
            }

            //Updating the category with the data that was sent
            category.name = name ? name : category.name;
            category.description = description ? description : category.description;

            //Saving the category
            await categoryRepository.save(category);

            //Returning the category
            return category;
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }

    //This method is used to delete a category
    async deleteCategory(id: number) {
        try {
            //Checking if the category exists
            const category = await categoryRepository.findOne({ where: { id } });

            //If the category does not exist, return an error
            if (!category) {
                return new ErrorWithStats('Category does not exists!', 404);
            }

            //Deleting the category
            await categoryRepository.delete(id);
        } catch (error) {
            //If an error occurs, return it
            return new ErrorWithStats(error.message, 400);
        }
    }
}
