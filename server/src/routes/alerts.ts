import { Router } from 'express';
import {
  getAlerts,
  getAlert,
  createAlert,
  markAlertRead,
} from '../controllers/alertController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.route('/')
  .get(protect, getAlerts)
  .post(protect, authorize(UserRole.ADMIN, UserRole.COORDINATOR), createAlert);

router.get('/:id', protect, getAlert);
router.put('/:id/read', protect, markAlertRead);

export default router;
