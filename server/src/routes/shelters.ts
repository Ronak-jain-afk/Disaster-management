import { Router } from 'express';
import {
  getShelters,
  getNearbyShelters,
  createShelter,
  updateShelterCapacity,
} from '../controllers/shelterController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.get('/nearby', getNearbyShelters);

router.route('/')
  .get(getShelters)
  .post(protect, authorize(UserRole.ADMIN), createShelter);

router.put('/:id/capacity', protect, authorize(UserRole.ADMIN, UserRole.COORDINATOR), updateShelterCapacity);

export default router;
