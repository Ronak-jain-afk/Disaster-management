import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/dashboard', protect, getDashboardStats);

export default router;
