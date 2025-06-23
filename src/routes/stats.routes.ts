import { Router } from 'express';
import { getStats } from '../controllers/stats.controller';
import { authenticated } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize';

const router = Router();

// This route is only accessible to super admins
router.get('/', authenticated, authorize(['super_admin']), getStats);

export default router;