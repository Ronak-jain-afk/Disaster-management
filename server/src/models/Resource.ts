import mongoose, { Document, Schema } from 'mongoose';
import { ResourceStatus } from '../types';

export interface IResource extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  status: ResourceStatus;
  location?: {
    type: string;
    coordinates: number[];
  };
  disaster?: mongoose.Types.ObjectId;
  allocatedTo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema<IResource>(
  {
    name: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Resource type is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(ResourceStatus),
      default: ResourceStatus.AVAILABLE,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: [Number],
    },
    disaster: {
      type: Schema.Types.ObjectId,
      ref: 'Disaster',
    },
    allocatedTo: String,
    notes: String,
  },
  { timestamps: true }
);

resourceSchema.index({ status: 1 });
resourceSchema.index({ disaster: 1 });

export default mongoose.model<IResource>('Resource', resourceSchema);
