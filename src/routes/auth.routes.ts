import express, { Router } from 'express';
import { 
  signup, 
  verifyEmail, 
  login, 
  forgotPassword, 
  resetPassword, 
  resendVerificationEmail
} from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { 
  signupSchema, 
  verifyEmailSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema, 
  ResendVerificationInput
} from '../schemas/auth.schemas';

const router: Router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/verify-email/:token', validate(verifyEmailSchema), verifyEmail);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);
router.post('/resend-verification', validate(ResendVerificationInput), resendVerificationEmail);

export default router;