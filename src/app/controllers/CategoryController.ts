import { ErrorWithStats } from './../model/ErrorWithStats';
import { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';

const categoryService = new CategoryService();

async function getAllCategories(req: Request, res: Response) {
    const result = await categoryService.getAllCategories();

    if (result instanceof ErrorWithStats) return res.status(result.status).json({ error: { message: result.message } });

    return res.json(result);
}

async function createCategory(req: Request, res: Response) {
    const { name, description } = req.body;

    const result = await categoryService.createCategory({ name, description });

    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    return res.status(201).json(result);
}

async function updateCategory(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description } = req.body;

    const result = await categoryService.updateCategory({ id: Number(id), name, description });

    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    return res.json(result);
}

async function deleteCategory(req: Request, res: Response) {
    const { id } = req.params;

    const result = await categoryService.deleteCategory(Number(id));

    if (result instanceof ErrorWithStats) {
        return res.status(result.status).json({ error: { message: result.message } });
    }

    return res.status(204).end();
}

export { getAllCategories, createCategory, updateCategory, deleteCategory };
