import express from 'express';
import userRoutes from './users.routes';
import authRoutes from './auth.routes';
import postRoutes from './blog.routes';
const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/posts', postRoutes)

export default router;