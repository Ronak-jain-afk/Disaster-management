import mongoose, { Document, Schema } from 'mongoose';

export interface IShelter extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  address: string;
  location: {
    type: string;
    coordinates: number[];
  };
  type: 'shelter' | 'hospital' | 'distribution_center';
  capacity: number;
  currentOccupancy: number;
  amenities: string[];
  contactPhone: string;
  createdAt: Date;
  updatedAt: Date;
}

const shelterSchema = new Schema<IShelter>(
  {
    name: {
      type: String,
      required: [true, 'Shelter name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
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
    type: {
      type: String,
      enum: ['shelter', 'hospital', 'distribution_center'],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 0,
    },
    currentOccupancy: {
      type: Number,
      default: 0,
      min: 0,
    },
    amenities: [String],
    contactPhone: String,
  },
  { timestamps: true }
);

shelterSchema.index({ location: '2dsphere' });
shelterSchema.index({ type: 1 });

export default mongoose.model<IShelter>('Shelter', shelterSchema);
