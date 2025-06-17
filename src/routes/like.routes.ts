import { Router } from 'express';
import { toggleLike } from '../controllers/like.controller';
import { authenticated } from '../middleware/auth.middleware'; // Your 'protect' middleware

const router = Router();


router.post(
  '/:recipeId/like', 
  authenticated, 
  toggleLike
);

export default router;