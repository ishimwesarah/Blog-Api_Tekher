import { Response, NextFunction } from 'express';
import { RecipeService } from '../services/recipe.service';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest, ApiResponse } from '../types/common.types';
import { NotFoundError } from '../utils/errors';

const recipeService = new RecipeService();

export const createRecipe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const input = req.body;
  const authorId = req.user!.id;

  // The Cloudinary URL is now in req.file
  if (!req.file) {
    throw new Error("Recipe image is required.");
  }
  const imageUrl = req.file.path;

  // Pass the imageUrl to the service
  const newRecipe = await recipeService.create({ ...input, imageUrl }, authorId);
  
  res.status(201).json({ success: true, message: 'Recipe created', data: newRecipe });
});

export const getAllRecipes = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const recipes = await recipeService.findAll();

  res.status(200).json({
    success: true,
    message: 'Recipes retrieved successfully',
    data: recipes,
  });
});

export const getRecipeById = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const id = parseInt(req.params.id, 10);
  const recipe = await recipeService.findById(id);

  if (!recipe) {
    throw new NotFoundError('Recipe not found');
  }

  res.status(200).json({
    success: true,
    message: 'Recipe retrieved successfully',
    data: recipe,
  });
});

export const updateRecipe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const input = req.body;
  let imageUrl = input.imageUrl; // Keep the old URL by default

  // If a new file was uploaded, use its new Cloudinary URL
  if (req.file) {
    imageUrl = req.file.path;
  }
  
  const updatedRecipe = await recipeService.update(id, { ...input, imageUrl });

  res.status(200).json({ success: true, message: 'Recipe updated', data: updatedRecipe });
});


export const deleteRecipe = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const id = parseInt(req.params.id, 10);
  
  await recipeService.delete(id);

  // A 204 No Content response is standard for successful deletions
  res.status(204).send();
});