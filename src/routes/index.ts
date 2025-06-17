import express from 'express';
import userRoutes from './users.routes';
import authRoutes from './auth.routes';
import postRoutes from './blog.routes';
import recipeRoutes from './recipe.routes';
// import likeRoutes from './like.routes';
import commentRoutes from './comment.routes';
import shoppingRoutes from './shoppingList.routes';
const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/recipes', recipeRoutes);
// router.use('/like', likeRoutes)
router.use('/comment', commentRoutes)
router.use('/shopping', shoppingRoutes)

export default router;