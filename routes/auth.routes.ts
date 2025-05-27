import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  requestPasswordReset,
  resetPassword,
  verifyAccount,
  requestNewVerificationOTP 
} from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.post('/request-otp', asyncHandler(requestNewVerificationOTP));
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/', authenticate, asyncHandler(getProfile));
router.post('/forgot-password', asyncHandler(requestPasswordReset));
router.post('/reset-password', asyncHandler(resetPassword));
router.post('/verify-email', asyncHandler(verifyAccount));


export default router;
