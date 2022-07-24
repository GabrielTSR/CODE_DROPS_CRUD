import { categoryRepository } from './../entity/repositories/repositories';
import { ErrorWithStats } from './../model/ErrorWithStats';
import { Request, Response } from 'express';
import { isIdValid } from '../utils/validation/isIdValid';
import { BaseService } from '../services/default/BaseService';
import { CategoryValidation } from '../validation/CategoryValidation';
import { Category } from '../entity/Category';

//Instantiating the services used
const baseService = new BaseService<Category>({
    validateDataFunction: CategoryValidation,
    entity: {
        repository: categoryRepository,
        name: 'Category',
    },
});

//This function is used to get all the categories
export async function getAllCategories(req: Request, res: Response) {
    //Using BaseService to get all the categories
    const result = await baseService.getAllEntities();

    //If an error occurred, return it
    if (result instanceof ErrorWithStats) return res.status(result.status).json({ error: { message: result.message } });

    //Returning the categories to the user
    return res.json(result);
}

//This function is used to create a new category
export async function createCategory(req: Request, res: Response) {
    //Using BategoryService to create a new category
    const result = await baseService.createEntity({ entityObj: req.body });

    //If an error occurred, return it
    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    //Returning the category
    return res.status(201).json(result);
}

//This function is used to update a category
export async function updateCategory(req: Request, res: Response) {
    //Getting id from params
    const { id } = req.params;

    //Checking if the id is a number
    if (!isIdValid(id)) return res.status(400).json({ error: { message: 'Invalid category id' } });

    //Using BategoryService to update a category
    const result = await baseService.updateEntity({ id: Number(id), entityObj: req.body, intention: 'put' });

    //If an error occurred, return it
    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    //Returning the category
    return res.json(result);
}

//This function is used to change a category attribute
export async function changeCategoryAttribute(req: Request, res: Response) {
    //Getting id from params
    const { id } = req.params;

    //Checking if the id is a number
    if (!isIdValid(id)) return res.status(400).json({ error: { message: 'Invalid category id' } });

    //Using BategoryService to update a category
    const result = await baseService.updateEntity({ id: Number(id), entityObj: req.body, intention: 'patch' });

    //If an error occurred, return it
    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    //Returning the category
    return res.json(result);
}

export async function deleteCategory(req: Request, res: Response) {
    //Getting id from params
    const { id } = req.params;

    //Checking if the id is a number
    if (!isIdValid(id)) return res.status(400).json({ error: { message: 'Invalid category id' } });

    //Using BaseService to delete a category
    const result = await baseService.deleteEntity(Number(id));

    //If an error occurred, return it
    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    //Returning the success response
    return res.status(204).end();
}
