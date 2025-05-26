import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import * as postsController from '../controllers/posts.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/addblog', authenticate, asyncHandler(postsController.createPost));
router.get('/getblog', asyncHandler(postsController.getAllPosts));
router.get('/getbyid/:id', asyncHandler(postsController.getPostById));
router.put('/update/:id', authenticate, asyncHandler(postsController.updatePost));
router.delete('/delete/:id', authenticate, asyncHandler(postsController.deletePost));

export default router;