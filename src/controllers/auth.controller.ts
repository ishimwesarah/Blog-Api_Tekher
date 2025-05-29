import { NextFunction, Request, RequestHandler, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

import { generateJWT, generateResetToken, generateVerifyToken } from '../utils/jwt';
import { sendResetPasswordEmail, sendVerificationEmail, sendEmailVerifiedConfirmation  } from '../utils/email';
import { asyncHandler } from '../middleware/errorHandler';

import { 
    SignupInput, 
    LoginInput, 
    ForgotPasswordInput, 
    ResetPasswordInput, 
    VerifyEmailInput 
  } from '../schemas/auth.schemas';
  import { AuthenticatedRequest, ApiResponse } from '../types/common.types';
  import { ConflictError, NotFoundError, UnauthorizedError, ForbiddenError } from '../utils/errors';

const authService = new AuthService 
const userService = new UserService 

//Create users
export const signup = asyncHandler(async (
    req: AuthenticatedRequest & SignupInput, 
    res: Response<ApiResponse>,
    next: NextFunction
) => {
        const { username, email, password, role } = req.body;

        const existingUser = await userService.findByEmail(email);

        if (existingUser) {
            throw new ConflictError('User with this email already exists');
        }

        const newUser = await authService.create({ username, email, password, role });
        const token = generateVerifyToken({ userId: newUser.id, email: newUser.email });
        const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

       await sendVerificationEmail(newUser.email, verifyLink);
       
       res.status(201).json({
        success: true,
        message: 'User created successfully. Please check your email and verify your account.',
        data: {
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
          }
        }
      });
}) as RequestHandler;

//Verify email
export const verifyEmail = asyncHandler(async (
  req: AuthenticatedRequest & VerifyEmailInput, 
  res: Response,
  next: NextFunction
) => {
  const { token } = req.params;

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

  const user = await userService.findById(payload.userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  if (user.isVerified) {
    throw new ConflictError('Email is already verified');
  }

  await userService.update(user.id, { isVerified: true });

  // ✅ Send confirmation email after successful verification
  await sendEmailVerifiedConfirmation(user.email);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
  });
});
//Login
export const login = asyncHandler(
  async (
    req: AuthenticatedRequest & LoginInput, 
    res: Response<ApiResponse>, 
    next: NextFunction
  ) => {
    const { email, password } = req.body;

    // Use your service to find and verify the user
    const user = await authService.login(email, password);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isVerified) {
      throw new ForbiddenError('Please verify your email before logging in');
    }

    if (!user.isActive) {
      throw new ForbiddenError('Your account has been deactivated');
    }

    // Generate JWT token
    const token = generateJWT(user);

    // Log token to console for debugging (remove in production)
    console.log('Generated JWT token:', token);

    // Return success response with user info and token
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { 
          id: user.id, 
          name: user.username, 
          email: user.email, 
          role: user.role 
        },
        token,
      },
    });
  }
);


//forgot Password
export const forgotPassword = asyncHandler(async (
    req: AuthenticatedRequest & ForgotPasswordInput, 
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    const { email } = req.body;
  
    const user = await userService.findByEmail(email);
    if (!user) {
      throw new NotFoundError('No user found with that email address');
    }
  
    const token = generateResetToken(user.email);
    const resetLink = `${process.env.RESET_PASSWORD_URL}/${token}`;
  
    await sendResetPasswordEmail(email, resetLink);
  
    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email'
    });
  });

// Reset Password
export const resetPassword = asyncHandler(async (
    req: AuthenticatedRequest & ResetPasswordInput, 
    res: Response<ApiResponse>,
    next: NextFunction
  ) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    const user = await userService.findByEmail(decoded.email);
  
    if (!user) {
      throw new NotFoundError('User');
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userService.update(user.id, { password: hashedPassword });
  
    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  });
  // Resend Verification Email
export const resendVerificationEmail = asyncHandler(async (
  req: AuthenticatedRequest, 
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const { email } = req.body;

  const user = await userService.findByEmail(email);
  if (!user) {
    throw new NotFoundError('User');
  }

  if (user.isVerified) {
    throw new ConflictError('Email is already verified');
  }

  const token = generateVerifyToken({ userId: user.id, email: user.email });
  const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  await sendVerificationEmail(user.email, verifyLink);

  res.status(200).json({
    success: true,
    message: 'A new verification link has been sent to your email',
  });
});

  