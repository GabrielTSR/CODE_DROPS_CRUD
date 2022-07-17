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

//Creating router
const router = Router();

//Routes for the auth controller
router.post('/auth', authenticate);
router.put('/auth', refresh);
router.post('/auth/forgot-password', forgotPassword);
router.get('/auth/is-my-reset-password-token-valid', validatePasswordResetToken);
router.patch('/auth/reset-password', resetPassword);

//Routes for the user controller
router.post('/users', store);
router.get('/users/me', authUser, getLoggedUser);

//Routes for the category controller
router.post('/categories', authUser, canManipulateCategories, createCategory);
router.delete('/categories/:id', authUser, canManipulateCategories, deleteCategory);
router.put('/categories/:id', authUser, canManipulateCategories, updateCategory);
router.get('/categories', authUser, getAllCategories);

//Routes for the video controller
router.post('/videos', authUser, canManipulateVideos, createVideo);
router.get('/videos', authUser, canManipulateVideos, getAllVideos);

//exporting the router
export { router };
