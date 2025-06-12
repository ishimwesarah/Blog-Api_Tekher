import { Router } from 'express';
import { toggleLike } from '../controllers/like.controller';
import {authenticated } from '../middleware/auth.middleware'; 

const router = Router();
// POST /api/recipes/:recipeId/like
router.post('/like', authenticated, toggleLike);
export default router;