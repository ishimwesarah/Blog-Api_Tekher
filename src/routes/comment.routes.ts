import { Router } from 'express';
import { 
  addCommentToRecipe, 
  updateComment, 
  deleteComment 
} from '../controllers/comment.controller';
import { authenticated } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';


const router = Router();
router.use(authenticated);
router.post('/recipes/:recipeId/comments', addCommentToRecipe);
router.put('/:commentId',   updateComment);
router.delete('/:commentId', deleteComment);


export default router;