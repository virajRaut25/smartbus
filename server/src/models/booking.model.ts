import { Schema, model, Types, type Document } from "mongoose";
import { BookingStatus, Gender } from "../types/enums.js";

export interface IBookingPassenger {
  seatId: Types.ObjectId;
  name: string;
  age: number;
  gender: Gender;
}

export interface IBookingStop {
  name: string;
  time?: string;
}

export interface IBooking extends Document {
  userId: Types.ObjectId;
  tripId: Types.ObjectId;
  passengers: IBookingPassenger[];
  status: BookingStatus;
  totalFare: number;
  paymentId?: Types.ObjectId;
  boardingPoint?: IBookingStop;
  alightingPoint?: IBookingStop;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bookingPassengerSchema = new Schema<IBookingPassenger>(
  {
    seatId: {
      type: Schema.Types.ObjectId,
      ref: "Seat",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true,
    },
  },
  { _id: false }
);

const bookingStopSchema = new Schema<IBookingStop>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tripId: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true,
    },
    passengers: {
      type: [bookingPassengerSchema],
      validate: {
        validator: (passengers: IBookingPassenger[]) => passengers.length >= 1,
        message: "A booking must include at least one passenger.",
      },
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
    totalFare: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    boardingPoint: {
      type: bookingStopSchema,
    },
    alightingPoint: {
      type: bookingStopSchema,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1, createdAt: -1 });

export const Booking = model<IBooking>("Booking", bookingSchema);
