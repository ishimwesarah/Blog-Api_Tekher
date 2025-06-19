import { Router } from 'express';
import { updateComment, deleteComment } from '../controllers/comment.controller';
import { authenticated } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All actions on a specific comment require a user to be logged in
router.use(authenticated);

// --- ✅ Routes for acting on a specific comment BY ITS OWN ID ---

// This creates the URL: PUT /comments/:id
router.put('/:id', /* validate(updateCommentSchema), */ updateComment);

// This creates the URL: DELETE /comments/:id
router.delete('/:id', deleteComment);

export default router;