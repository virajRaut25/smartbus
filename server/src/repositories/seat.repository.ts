import { Seat, type ISeat } from "../models/seat.model.js";
import type { Deck } from "../types/enums.js";

export interface CreateSeatInput {
  tripId: string;
  seatNumber: string;
  deck?: Deck;
}

export function createSeats(inputs: CreateSeatInput[]): Promise<ISeat[]> {
  return Seat.create(inputs);
}

export function findSeatsByTrip(tripId: string): Promise<ISeat[]> {
  return Seat.find({ tripId }).sort({ seatNumber: 1 });
}

export function findSeatByTripAndNumber(
  tripId: string,
  seatNumber: string
): Promise<ISeat | null> {
  return Seat.findOne({ tripId, seatNumber });
}

export function countSeatsForTrip(tripId: string): Promise<number> {
  return Seat.countDocuments({ tripId });
}
