import { Response, NextFunction } from 'express';
import { LikeService } from '../services/like.service';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest, ApiResponse } from '../types/common.types';

const likeService = new LikeService();

export const toggleLike = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const recipeId = parseInt(req.params.recipeId, 10);
  const userId = req.user!.id; // Get the ID of the logged-in user from the token.

  // Call the service to either create or delete the like.
  const result = await likeService.toggleLike(userId, recipeId);

  res.status(200).json({
    success: true,
    message: result.liked ? 'Recipe liked successfully' : 'Recipe unliked successfully',
    data: result, // Send back { liked: true } or { liked: false }
  });
});