import { Request, Response } from 'express';
import Disaster from '../models/Disaster';
import User from '../models/User';
import Resource from '../models/Resource';
import Shelter from '../models/Shelter';
import { DisasterStatus, UserRole, ResourceStatus } from '../types';
import asyncHandler from '../utils/asyncHandler';

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const [activeDisasters, activeVolunteers, availableResources, shelters] = await Promise.all([
    Disaster.countDocuments({ status: DisasterStatus.ACTIVE }),
    User.countDocuments({ role: UserRole.VOLUNTEER, isActive: true }),
    Resource.aggregate([
      { $match: { status: ResourceStatus.AVAILABLE } },
      { $group: { _id: null, total: { $sum: '$quantity' } } },
    ]),
    Shelter.countDocuments(),
  ]);

  res.json({
    success: true,
    data: {
      activeDisasters,
      activeVolunteers,
      availableResources: availableResources[0]?.total || 0,
      totalShelters: shelters,
    },
  });
});
