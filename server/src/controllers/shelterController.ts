import { Request, Response } from 'express';
import Shelter from '../models/Shelter';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';

export const getShelters = asyncHandler(async (_req: Request, res: Response) => {
  const shelters = await Shelter.find().sort({ name: 1 });
  res.json({ success: true, count: shelters.length, data: shelters });
});

export const getNearbyShelters = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lng, radius = '5000', type } = req.query;

  if (!lat || !lng) {
    throw new ApiError(400, 'Latitude and longitude are required');
  }

  const filter: Record<string, any> = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
        },
        $maxDistance: parseInt(radius as string, 10),
      },
    },
  };

  if (type) filter.type = type;

  const shelters = await Shelter.find(filter);
  res.json({ success: true, count: shelters.length, data: shelters });
});

export const createShelter = asyncHandler(async (req: Request, res: Response) => {
  const shelter = await Shelter.create(req.body);
  res.status(201).json({ success: true, data: shelter });
});

export const updateShelterCapacity = asyncHandler(async (req: Request, res: Response) => {
  const { currentOccupancy } = req.body;
  const shelter = await Shelter.findById(req.params.id);

  if (!shelter) throw new ApiError(404, 'Shelter not found');

  if (currentOccupancy > shelter.capacity) {
    throw new ApiError(400, 'Occupancy cannot exceed capacity');
  }

  shelter.currentOccupancy = currentOccupancy;
  await shelter.save();

  res.json({ success: true, data: shelter });
});
