import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTaskStatus,
  addTaskProgress,
} from '../controllers/taskController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, authorize(UserRole.ADMIN, UserRole.COORDINATOR), createTask);

router.put('/:id/status', protect, updateTaskStatus);
router.post('/:id/updates', protect, addTaskProgress);

export default router;
