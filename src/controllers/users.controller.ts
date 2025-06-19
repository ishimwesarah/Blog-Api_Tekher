import { Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { asyncHandler } from '../middleware/errorHandler';
import { 
  UpdateUserInput, 
  GetUserByIdInput, 
  SearchUsersInput, 
  DeleteUserInput, 
  InviteUserInput,
  UpdateMyProfileInput
} from '../schemas/user.schemas';
import { ChangeRoleInput } from '../schemas/user.schemas';
import { AuthenticatedRequest, ApiResponse } from '../types/common.types';
import { NotFoundError, ConflictError } from '../utils/errors';
import { sendAccountSetupEmail } from '../utils/email';

const userService = new UserService();

export const getAllUsers = asyncHandler(async (
  req: AuthenticatedRequest, 
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const users = await userService.findAll();
  
  res.json({
    success: true,
    message: 'Users retrieved successfully',
    data: { users }
  });
});

export const search = asyncHandler(async (
  req: AuthenticatedRequest & SearchUsersInput, 
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const { name } = req.query;
  
  const users = name ? await userService.findByName(name) : [];
  
  res.json({
    success: true,
    message: 'Search completed successfully',
    data: { users, count: users.length }
  });
});

export const getById = asyncHandler(async (
  req: AuthenticatedRequest & GetUserByIdInput, 
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const { id } = req.params;
  
  const user = await userService.findById(id);
  if (!user) {
    throw new NotFoundError('User');
  }
  
  res.json({
    success: true,
    message: 'User retrieved successfully',
    data: { user }
  });
});

export const updateUser = asyncHandler(async (
  req: AuthenticatedRequest & UpdateUserInput, 
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const { id } = req.params;
  const updateData = req.body;

  const existingUser = await userService.findById(id);
  if (!existingUser) {
    throw new NotFoundError('User');
  }
  if (updateData.email && updateData.email !== existingUser.email) {
    const userWithEmail = await userService.findByEmail(updateData.email);
    if (userWithEmail) {
      throw new ConflictError('Email is already in use');
    }
  }
  
  const updatedUser = await userService.update(id, updateData);
  
  res.json({
    success: true,
    message: 'User updated successfully',
    data: { user: updatedUser }
  });
});

export const deleteUser = asyncHandler(async (
  req: AuthenticatedRequest & DeleteUserInput, 
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const { id } = req.params;
  
  const user = await userService.findById(id);
  if (!user) {
    throw new NotFoundError('User');
  }
  
  const deleted = await userService.delete(id);
  if (!deleted) {
    throw new Error('Failed to delete user');
  }
  
  res.json({
    
    success: true,
    message: 'User deleted successfully'
  });
});

export const changeUserRole = asyncHandler(async (
  req: AuthenticatedRequest & ChangeRoleInput,
  res: Response<ApiResponse>
) => {
  const { id } = req.params;
  const { role } = req.body;

  
  const updatedUser = await userService.update(parseInt(id), { role });

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    data: { user: updatedUser },
  });
});
export const inviteUser = asyncHandler(async (
  req: AuthenticatedRequest & InviteUserInput, 
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const { username, email, role } = req.body;

  const { newUser, setupToken } = await userService.createInvitation(username, email, role);
  const setupLink = `${process.env.MOBILE_APP_URL_SCHEME}setup-account/${setupToken}`;
  console.log("--- ACCOUNT SETUP TOKEN ---");
console.log(setupToken);

  await sendAccountSetupEmail(email, setupLink);

  res.status(201).json({
    success: true,
    message: `Invitation sent successfully to ${email}.`,
  });
});

export const updateMyProfile = asyncHandler(async (
  req: AuthenticatedRequest, // We remove the Zod type since we removed the middleware
  res: Response<ApiResponse>
) => {
  const userId = req.user!.id;
  const updateData = req.body; // Contains username and bio

  // --- ✅ HANDLE THE UPLOADED FILE ---
  // If the user uploaded a new profile picture, its Cloudinary URL will be in req.file.path.
  if (req.file) {
    updateData.profilePictureUrl = req.file.path;
  }

  // Pass the combined data to the service.
  const updatedUser = await userService.update(userId, updateData);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: { user: updatedUser },
  });
});
export const getMyProfile = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
) => {
  
  const userId = req.user!.id;

  const freshUser = await userService.findById(userId);

  if (!freshUser) {
    throw new NotFoundError("User associated with this token could not be found.");
  }
  res.status(200).json({
    success: true,
    message: "Profile retrieved successfully",
    data: { user: freshUser },
  });
});
