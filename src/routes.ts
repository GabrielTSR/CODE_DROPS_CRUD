import { createCategory, deleteCategory, getAllCategories, updateCategory } from './app/controllers/CategoryController';
import { createVideo, getAllVideos } from './app/controllers/VideoController';
import { store } from './app/controllers/UserController';
import {
    authenticate,
    forgotPassword,
    getLoggedUser,
    refresh,
    resetPassword,
    validatePasswordResetToken,
} from './app/controllers/AuthController';

import { authUser, canManipulateCategories, canManipulateVideos } from './app/middlewares/authMiddlewares';
import { Router } from 'express';

const router = Router();

router.post('/auth', authenticate);
router.put('/auth', refresh);
router.post('/auth/forgot-password', forgotPassword);
router.get('/auth/is-my-reset-password-token-valid', validatePasswordResetToken);
router.patch('/auth/reset-password', resetPassword);

router.post('/users', store);
router.get('/users/me', authUser, getLoggedUser);

router.post('/videos', authUser, canManipulateVideos, createVideo);
router.get('/videos', authUser, canManipulateVideos, getAllVideos);

router.post('/categories', authUser, canManipulateCategories, createCategory);
router.delete('/categories/:id', authUser, canManipulateCategories, deleteCategory);
router.put('/categories/:id', authUser, canManipulateCategories, updateCategory);
router.get('/categories', authUser, getAllCategories);

export { router };
