// comment.controller.ts - Fixed parameter names
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
  const recipeId = parseInt(req.params.id, 10); // Changed from recipeId to id
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
  const commentId = parseInt(req.params.id, 10); // This stays the same
  const { text } = req.body;
  const user = req.user!;

  const comment = await commentService.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  // Permission check: Only the original author can edit their own comment
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
  const commentId = parseInt(req.params.id, 10);
  const user = req.user!;

  const comment = await commentService.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  // Permission check: Author or admin can delete
  if (comment.author.id !== user.id && user.role !== 'admin' && user.role !== 'super_admin') {
    throw new ForbiddenError("You are not authorized to delete this comment");
  }

  await commentService.delete(commentId);

  res.status(204).send();
});