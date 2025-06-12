import { Router } from 'express';
import { addCommentToRecipe, updateComment, deleteComment } from '../controllers/comment.controller';
import {authenticated } from '../middleware/auth.middleware'; ;

const router = Router();

router.post('/comments', authenticated, addCommentToRecipe);


router.put('/:commentId', authenticated, updateComment);
router.delete('/:commentId', authenticated, deleteComment);
export default router;