import { Router } from 'express';
import {
  getResources,
  getResourcesByDisaster,
  createResource,
  allocateResource,
  updateResourceStatus,
} from '../controllers/resourceController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.get('/disasters/:id', protect, getResourcesByDisaster);

router.route('/')
  .get(protect, getResources)
  .post(protect, authorize(UserRole.ADMIN, UserRole.COORDINATOR), createResource);

router.put('/:id/allocate', protect, authorize(UserRole.ADMIN, UserRole.COORDINATOR), allocateResource);
router.put('/:id/status', protect, authorize(UserRole.ADMIN, UserRole.COORDINATOR), updateResourceStatus);

export default router;
