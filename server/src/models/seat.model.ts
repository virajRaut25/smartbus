import { Schema, model, Types, type Document } from "mongoose";
import { Deck, SeatStatus } from "../types/enums.js";

export interface ISeat extends Document {
  tripId: Types.ObjectId;
  seatNumber: string;
  deck?: Deck;
  status: SeatStatus;
  bookingId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const seatSchema = new Schema<ISeat>(
  {
    tripId: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    seatNumber: {
      type: String,
      required: true,
      trim: true,
    },
    deck: {
      type: String,
      enum: Object.values(Deck),
    },
    status: {
      type: String,
      enum: Object.values(SeatStatus),
      default: SeatStatus.AVAILABLE,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
  },
  { timestamps: true }
);

seatSchema.index({ tripId: 1, seatNumber: 1 }, { unique: true });
seatSchema.index({ tripId: 1, status: 1 });

export const Seat = model<ISeat>("Seat", seatSchema);
