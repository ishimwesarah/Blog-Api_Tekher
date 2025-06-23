import { Response, NextFunction } from 'express';
import { StatsService } from '../services/stats.service';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest, ApiResponse } from '../types/common.types';

const statsService = new StatsService();

export const getStats = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
) => {
  const stats = await statsService.getDashboardStats();
  res.status(200).json({
    success: true,
    message: "Statistics retrieved successfully",
    data: stats,
  });
});