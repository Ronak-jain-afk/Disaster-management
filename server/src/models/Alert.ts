import mongoose, { Document, Schema } from 'mongoose';
import { AlertPriority, UserRole } from '../types';

export interface IAlert extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  message: string;
  priority: AlertPriority;
  disaster?: mongoose.Types.ObjectId;
  targetRoles: UserRole[];
  location?: {
    type: string;
    coordinates: number[];
  };
  readBy: Array<{ user: mongoose.Types.ObjectId; readAt: Date }>;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const alertSchema = new Schema<IAlert>(
  {
    title: {
      type: String,
      required: [true, 'Alert title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Alert message is required'],
    },
    priority: {
      type: String,
      enum: Object.values(AlertPriority),
      default: AlertPriority.MEDIUM,
    },
    disaster: {
      type: Schema.Types.ObjectId,
      ref: 'Disaster',
    },
    targetRoles: [
      {
        type: String,
        enum: Object.values(UserRole),
      },
    ],
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: [Number],
    },
    readBy: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        readAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

alertSchema.index({ createdAt: -1 });
alertSchema.index({ targetRoles: 1 });

export default mongoose.model<IAlert>('Alert', alertSchema);
