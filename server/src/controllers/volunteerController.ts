import { Request, Response } from 'express';
import User from '../models/User';
import Task from '../models/Task';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';
import { UserRole } from '../types';

export const registerVolunteer = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { skills, phone, location } = req.body;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  if (skills) user.skills = skills;
  if (phone) user.phone = phone;
  if (location) user.location = location;

  user.role = UserRole.VOLUNTEER;
  await user.save();

  res.json({ success: true, data: user });
});

export const getVolunteerTasks = asyncHandler(async (req: Request, res: Response) => {
  const volunteerId = req.params.id;
  const { status } = req.query;

  const filter: Record<string, any> = { assignedTo: volunteerId };
  if (status) filter.status = status;

  const tasks = await Task.find(filter)
    .populate('disaster', 'name type severity')
    .populate('assignedBy', 'name')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: tasks.length, data: tasks });
});
