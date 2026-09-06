import { Schema, model, type Document } from "mongoose";

export interface IStopPoint {
  name: string;
  distanceFromSourceKm: number;
}

export interface IRoute extends Document {
  source: string;
  destination: string;
  distanceKm?: number;
  estimatedDurationMinutes?: number;
  boardingPoints: IStopPoint[];
  alightingPoints: IStopPoint[];
  createdAt: Date;
  updatedAt: Date;
}

const stopPointSchema = new Schema<IStopPoint>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    distanceFromSourceKm: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const routeSchema = new Schema<IRoute>(
  {
    source: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    distanceKm: {
      type: Number,
      min: 0,
    },
    estimatedDurationMinutes: {
      type: Number,
      min: 0,
    },
    boardingPoints: {
      type: [stopPointSchema],
      default: [],
    },
    alightingPoints: {
      type: [stopPointSchema],
      default: [],
    },
  },
  { timestamps: true }
);

routeSchema.index({ source: 1, destination: 1 });
routeSchema.index({ "boardingPoints.name": 1 });
routeSchema.index({ "alightingPoints.name": 1 });

export const Route = model<IRoute>("Route", routeSchema);
