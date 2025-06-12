import { Response, NextFunction } from 'express';
import { CommentService } from '../services/comment.service';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest, ApiResponse } from '../types/common.types';
import { NotFoundError, ForbiddenError } from '../utils/errors';

const commentService = new CommentService();

// --- CREATE ---
export const addCommentToRecipe = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const recipeId = parseInt(req.params.recipeId, 10);
  const { text } = req.body;
  const authorId = req.user!.id;

  const newComment = await commentService.create(text, authorId, recipeId);

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: newComment,
  });
});

// --- UPDATE ---
export const updateComment = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const commentId = parseInt(req.params.commentId, 10);
  const { text } = req.body;
  const user = req.user!; // The user trying to make the change

  const comment = await commentService.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  // 🚨 PERMISSION CHECK: Only the original author can edit their own comment.
  if (comment.author.id !== user.id) {
    throw new ForbiddenError("You are not authorized to edit this comment");
  }

  const updatedComment = await commentService.update(commentId, text);

  res.status(200).json({
    success: true,
    message: 'Comment updated successfully',
    data: updatedComment,
  });
});

// --- DELETE ---
export const deleteComment = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const commentId = parseInt(req.params.commentId, 10);
  const user = req.user!; // The user trying to make the change

  const comment = await commentService.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  // 🚨 PERMISSION CHECK: The original author OR an admin can delete a comment.
  if (comment.author.id !== user.id && user.role !== 'admin') {
    throw new ForbiddenError("You are not authorized to delete this comment");
  }

  await commentService.delete(commentId);

  // A 204 No Content response is perfect for successful deletions.
  res.status(204).send();
});