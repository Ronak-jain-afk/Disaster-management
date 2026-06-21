import mongoose, { Document, Schema } from 'mongoose';
import { DisasterStatus, DisasterSeverity } from '../types';

export interface IDisaster extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  type: string;
  description: string;
  location: {
    type: string;
    coordinates: number[];
  };
  address?: string;
  status: DisasterStatus;
  severity: DisasterSeverity;
  reportedBy: mongoose.Types.ObjectId;
  affectedArea?: {
    type: string;
    coordinates: number[][][];
  };
  mediaUrls?: string[];
  casualties?: number;
  displaced?: number;
  createdAt: Date;
  updatedAt: Date;
}

const disasterSchema = new Schema<IDisaster>(
  {
    name: {
      type: String,
      required: [true, 'Disaster name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Disaster type is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    address: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(DisasterStatus),
      default: DisasterStatus.ACTIVE,
    },
    severity: {
      type: String,
      enum: Object.values(DisasterSeverity),
      default: DisasterSeverity.MEDIUM,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    affectedArea: {
      type: {
        type: String,
        enum: ['Polygon'],
      },
      coordinates: [[[Number]]],
    },
    mediaUrls: [String],
    casualties: {
      type: Number,
      min: 0,
    },
    displaced: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

disasterSchema.index({ location: '2dsphere' });
disasterSchema.index({ status: 1, severity: -1 });
disasterSchema.index({ reportedBy: 1 });

export default mongoose.model<IDisaster>('Disaster', disasterSchema);
