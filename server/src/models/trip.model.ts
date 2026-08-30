import { Schema, model, Types, type Document } from "mongoose";
import { TripStatus } from "../types/enums.js";

export interface ITrip extends Document {
  routeId: Types.ObjectId;
  busId: Types.ObjectId;
  operatorId: Types.ObjectId;
  departureTime: Date;
  arrivalTime: Date;
  fare: number;
  status: TripStatus;
  availableSeatsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const tripSchema = new Schema<ITrip>(
  {
    routeId: {
      type: Schema.Types.ObjectId,
      ref: "Route",
      required: true,
      index: true,
    },
    busId: {
      type: Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
      index: true,
    },
    operatorId: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
      index: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(TripStatus),
      default: TripStatus.SCHEDULED,
    },
    availableSeatsCount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

tripSchema.index({ routeId: 1, departureTime: 1 });

export const Trip = model<ITrip>("Trip", tripSchema);
