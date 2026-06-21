import { Request, Response } from 'express';
import Task from '../models/Task';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const { status, disaster } = req.query;
  const filter: Record<string, any> = {};

  if (status) filter.status = status;
  if (disaster) filter.disaster = disaster;

  const tasks = await Task.find(filter)
    .populate('assignedTo', 'name email phone')
    .populate('assignedBy', 'name')
    .populate('disaster', 'name type severity')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: tasks.length, data: tasks });
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  req.body.assignedBy = (req as any).user.id;
  const task = await Task.create(req.body);
  res.status(201).json({ success: true, data: task });
});

export const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) throw new ApiError(404, 'Task not found');

  task.status = status;
  await task.save();

  res.json({ success: true, data: task });
});

export const addTaskProgress = asyncHandler(async (req: Request, res: Response) => {
  const { message } = req.body;
  const userId = (req as any).user.id;

  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');

  task.progressUpdates.push({
    message,
    userId,
    createdAt: new Date(),
  } as any);

  await task.save();

  res.json({ success: true, data: task });
});
