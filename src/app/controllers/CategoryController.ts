import { ErrorWithStats } from './../model/ErrorWithStats';
import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';
import { isIdValid } from '../validation/isIdValid';

//Instantiating the services used
const categoryService = new CategoryService();

//This function is used to get all the categories
async function getAllCategories(req: Request, res: Response) {
    //Using CategoryService to get all the categories
    const result = await categoryService.getAllCategories();

    //If an error occurred, return it
    if (result instanceof ErrorWithStats) return res.status(result.status).json({ error: { message: result.message } });

    //Returning the categories to the user
    return res.json(result);
}

//This function is used to create a new category
async function createCategory(req: Request, res: Response) {
    //Getting the data from the request body
    const { name, description } = req.body;

    //Using CategoryService to create a new category
    const result = await categoryService.createCategory({ name, description });

    //If an error occurred, return it
    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    //Returning the category
    return res.status(201).json(result);
}

//This function is used to update a category
async function updateCategory(req: Request, res: Response) {
    //Getting id from params
    const { id } = req.params;

    //Getting the data from the request body
    const { name, description } = req.body;

    //Checking if the id is a number
    if (!isIdValid(id)) return res.status(400).json({ error: { message: 'Invalid category id' } });

    //Using CategoryService to update a category
    const result = await categoryService.updateCategory({ id: Number(id), name, description });

    //If an error occurred, return it
    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    //Returning the category
    return res.json(result);
}

async function deleteCategory(req: Request, res: Response) {
    //Getting id from params
    const { id } = req.params;

    //Checking if the id is a number
    if (!isIdValid(id)) return res.status(400).json({ error: { message: 'Invalid category id' } });

    //Using CategoryService to delete a category
    const result = await categoryService.deleteCategory(Number(id));

    //If an error occurred, return it
    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    //Returning the success response
    return res.status(204).end();
}

export { getAllCategories, createCategory, updateCategory, deleteCategory };
