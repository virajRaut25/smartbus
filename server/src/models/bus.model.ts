import { Schema, model, Types, type Document } from "mongoose";
import { BusType } from "../types/enums.js";

export interface IBus extends Document {
  operatorId: Types.ObjectId;
  registrationNumber: string;
  name?: string;
  busType: BusType;
  totalSeats: number;
  amenities: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const busSchema = new Schema<IBus>(
  {
    operatorId: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
      required: true,
      index: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    busType: {
      type: String,
      enum: Object.values(BusType),
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    amenities: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Bus = model<IBus>("Bus", busSchema);
