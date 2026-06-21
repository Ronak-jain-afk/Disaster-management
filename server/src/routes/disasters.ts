import { Router } from 'express';
import {
  getDisasters,
  getDisaster,
  createDisaster,
  updateDisaster,
  deleteDisaster,
} from '../controllers/disasterController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.route('/')
  .get(protect, getDisasters)
  .post(protect, authorize(UserRole.ADMIN, UserRole.COORDINATOR), createDisaster);

router.route('/:id')
  .get(protect, getDisaster)
  .put(protect, authorize(UserRole.ADMIN, UserRole.COORDINATOR), updateDisaster)
  .delete(protect, authorize(UserRole.ADMIN), deleteDisaster);

export default router;
