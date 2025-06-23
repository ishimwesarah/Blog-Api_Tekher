import express from 'express';
import userRoutes from './users.routes';
import authRoutes from './auth.routes';
import postRoutes from './blog.routes';
import recipeRoutes from './recipe.routes';
// import likeRoutes from './like.routes';
import commentRoutes from './comment.routes';
import shoppingRoutes from './shoppingList.routes';
import statsRoutes from './stats.routes';
const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/recipes', recipeRoutes);
// router.use('/like', likeRoutes)
router.use('/comments', commentRoutes)
router.use('/shopping', shoppingRoutes)
router.use('/stats', statsRoutes)

export default router;