import { createCategory, deleteCategory, getAllCategories, updateCategory } from './app/controllers/CategoryController';
import { createVideo, getAllVideos } from './app/controllers/VideoController';
import { store } from './app/controllers/UserController';
import {
    authenticate,
    forgotPassword,
    refresh,
    resetPassword,
    validatePasswordResetToken,
} from './app/controllers/AuthController';

import { Router } from 'express';
import authMiddleware from './app/middlewares/authMiddleware';

const router = Router();

router.post('/auth', authenticate);
router.put('/auth', refresh);
router.post('/auth/forgot-password', forgotPassword);
router.get('/auth/is-my-token-valid', validatePasswordResetToken);
router.patch('/auth/reset-password', resetPassword);

router.post('/users', store);

router.post('/categories', authMiddleware, createCategory);
router.get('/categories', getAllCategories);
router.delete('/categories/:id', deleteCategory);
router.put('/categories/:id', updateCategory);

router.post('/videos', createVideo);
router.get('/videos', getAllVideos);

export { router };
