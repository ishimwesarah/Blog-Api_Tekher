import { Router } from 'express';
import { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe } from '../controllers/recipe.controller';
import {authenticated } from '../middleware/auth.middleware'; // Import your auth middleware
import { validate } from '../middleware/validation.middleware'; // Import your Zod validation middleware
import { createRecipeSchema, updateRecipeSchema } from '../schemas/recipe.schemas';
import upload from '../middleware/upload';

const router = Router();

router.get('/get', getAllRecipes);
router.get('/get/:id', getRecipeById);


router.post('/create', authenticated, upload.single('image'),validate(createRecipeSchema), createRecipe);

router.put('/update/:id', authenticated,upload.single('image'), validate(updateRecipeSchema), updateRecipe);
router.delete('/delete/:id', authenticated, deleteRecipe);

export default router;