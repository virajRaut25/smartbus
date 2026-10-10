import { createSeats, countSeatsForTrip } from "../repositories/seat.repository.js";
import { BusType, Deck } from "../types/enums.js";
import type { ISeat } from "../models/seat.model.js";
import { ApiError } from "../utils/ApiError.js";

export interface GenerateSeatsInput {
  tripId: string;
  totalSeats: number;
  busType: BusType;
}

const SLEEPER_TYPES: BusType[] = [BusType.SLEEPER, BusType.AC_SLEEPER];

export async function generateSeatsForTrip(input: GenerateSeatsInput): Promise<ISeat[]> {
  const existingCount = await countSeatsForTrip(input.tripId);
  if (existingCount > 0) {
    throw ApiError.conflict("Seats have already been generated for this trip");
  }

  const isSleeper = SLEEPER_TYPES.includes(input.busType);
  const lowerCount = isSleeper ? Math.ceil(input.totalSeats / 2) : 0;
  const numberWidth = String(input.totalSeats).length;

  const seats = Array.from({ length: input.totalSeats }, (_, index) => {
    const seatNumber = String(index + 1).padStart(numberWidth, "0");
    if (!isSleeper) {
      return { tripId: input.tripId, seatNumber };
    }
    const deck: Deck = index < lowerCount ? Deck.LOWER : Deck.UPPER;
    return { tripId: input.tripId, seatNumber, deck };
  });

  return createSeats(seats);
}
