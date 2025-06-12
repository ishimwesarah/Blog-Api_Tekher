import { Response, NextFunction } from 'express';
import { ShoppingListService } from '../services/shoppingList.service';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest, ApiResponse } from '../types/common.types';
import { NotFoundError } from '../utils/errors';

const listService = new ShoppingListService();

export const getMyList = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const items = await listService.findByUserId(req.user!.id);
  res.status(200).json({ success: true, data: items });
});

export const addItemsToList = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { items } = req.body; // Expects an array of strings: `["Milk", "Eggs"]`
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Items array is required." });
  }
  const newItems = await listService.addItems(items, req.user!);
  res.status(201).json({ success: true, data: newItems });
});

export const toggleListItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const itemId = parseInt(req.params.id, 10);
  const updatedItem = await listService.toggleItem(itemId, req.user!.id);
  if (!updatedItem) throw new NotFoundError("Item not found or you do not have permission.");
  res.status(200).json({ success: true, data: updatedItem });
});

export const deleteListItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const itemId = parseInt(req.params.id, 10);
  const success = await listService.deleteItem(itemId, req.user!.id);
  if (!success) throw new NotFoundError("Item not found or you do not have permission.");
  res.status(204).send();
});