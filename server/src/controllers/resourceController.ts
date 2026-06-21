import { Request, Response } from 'express';
import Resource from '../models/Resource';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';
import { ResourceStatus } from '../types';

export const getResources = asyncHandler(async (req: Request, res: Response) => {
  const { status, type } = req.query;
  const filter: Record<string, any> = {};

  if (status) filter.status = status;
  if (type) filter.type = type;

  const resources = await Resource.find(filter)
    .populate('disaster', 'name type severity status')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: resources.length, data: resources });
});

export const getResourcesByDisaster = asyncHandler(async (req: Request, res: Response) => {
  const resources = await Resource.find({ disaster: req.params.id })
    .sort({ createdAt: -1 });

  res.json({ success: true, count: resources.length, data: resources });
});

export const createResource = asyncHandler(async (req: Request, res: Response) => {
  const resource = await Resource.create(req.body);
  res.status(201).json({ success: true, data: resource });
});

export const allocateResource = asyncHandler(async (req: Request, res: Response) => {
  const { quantity, allocatedTo, disaster } = req.body;
  const resource = await Resource.findById(req.params.id);

  if (!resource) throw new ApiError(404, 'Resource not found');

  if (quantity > resource.quantity) {
    throw new ApiError(400, 'Allocation exceeds available quantity');
  }

  resource.quantity -= quantity;
  resource.allocatedTo = allocatedTo || resource.allocatedTo;
  if (disaster) resource.disaster = disaster;

  if (resource.quantity === 0) {
    resource.status = ResourceStatus.DEPLETED;
  } else {
    resource.status = ResourceStatus.DEPLOYED;
  }

  await resource.save();

  res.json({ success: true, data: resource });
});

export const updateResourceStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!resource) throw new ApiError(404, 'Resource not found');

  res.json({ success: true, data: resource });
});
