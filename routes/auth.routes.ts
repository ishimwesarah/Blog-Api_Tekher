import { Router } from 'express';
import { register, login, getProfile,requestPasswordReset,
  resetPassword } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middlewares/auth.middleware';


const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', authenticate, asyncHandler(getProfile));
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);
export default router;