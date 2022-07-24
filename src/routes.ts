import {
    changeCategoryAttribute,
    createCategory,
    deleteCategory,
    getAllCategories,
    updateCategory,
} from './app/controllers/CategoryController';
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
import { deleteLike, likeVideo, videosLikedByMe } from './app/controllers/LikeController';

//Creating router
const routes = Router();

//Routes for the auth controller
routes.post('/auth', authenticate);
routes.put('/auth', refresh);
routes.post('/auth/forgot-password', forgotPassword);
routes.get('/auth/is-my-reset-password-token-valid', validatePasswordResetToken);
routes.patch('/auth/reset-password', resetPassword);

//Routes for the user controller
routes.post('/users', store);
routes.get('/users/me', authUser, getLoggedUser);

//Routes for the category controller
routes.post('/categories', authUser, canManipulateCategories, createCategory);
routes.delete('/categories/:id', authUser, canManipulateCategories, deleteCategory);
routes.put('/categories/:id', authUser, canManipulateCategories, updateCategory);
routes.patch('/categories/:id', authUser, canManipulateCategories, changeCategoryAttribute);
routes.get('/categories', authUser, getAllCategories);

//Routes for the video controller
routes.post('/videos', authUser, canManipulateVideos, createVideo);
routes.get('/videos', authUser, canManipulateVideos, getAllVideos);

//Routes for the like controller
routes.get('/videos/likes/me', authUser, videosLikedByMe);
routes.post('/videos/:id_video/likes', authUser, likeVideo);
routes.delete('/videos/:id_video/likes', authUser, deleteLike);

//exporting the router
export { routes };
