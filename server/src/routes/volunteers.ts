import { Router } from 'express';
import { registerVolunteer, getVolunteerTasks } from '../controllers/volunteerController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', protect, registerVolunteer);
router.get('/:id/tasks', protect, getVolunteerTasks);

export default router;
