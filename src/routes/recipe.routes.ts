import { Router } from 'express';
import { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe } from '../controllers/recipe.controller';
import { toggleLike } from '../controllers/like.controller'; // Import from like controller
import { addCommentToRecipe } from '../controllers/comment.controller'; // Import from comment controller
import { authenticated } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createRecipeSchema, updateRecipeSchema } from '../schemas/recipe.schemas';
import upload from '../middleware/upload';

const router = Router();

// --- Get Recipes (Public) ---
router.get('/get', getAllRecipes);
router.get('/get/:id', getRecipeById);

// --- All routes below require a user to be logged in ---
router.use(authenticated);

// --- Recipe CRUD (Admin Only) ---
router.post('/create', upload.single('image'), validate(createRecipeSchema), createRecipe);
router.put('/update/:id', upload.single('image'), validate(updateRecipeSchema), updateRecipe);
router.delete('/delete/:id', deleteRecipe);

// --- ✅ LIKES: An action on a specific recipe ---
// This creates the URL: POST /recipes/:id/like
router.post('/:id/like', toggleLike);

// --- ✅ COMMENTS: An action to add a comment to a specific recipe ---
// This creates the URL: POST /recipes/:id/comments
router.post('/:id/comments', /* validate(createCommentSchema), */ addCommentToRecipe);

export default router;