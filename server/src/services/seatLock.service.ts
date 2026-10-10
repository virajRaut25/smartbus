import {
  acquireSeatLock,
  releaseSeatLock,
  getSeatLockOwner,
  getSeatLockTtlSeconds,
  getSeatLockOwners,
} from "../repositories/seatLock.repository.js";
import { findSeatByTripAndNumber, findSeatsByTrip } from "../repositories/seat.repository.js";
import { findTripById } from "../repositories/trip.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { SeatStatus, type Deck } from "../types/enums.js";

const SEAT_LOCK_TTL_SECONDS = 5 * 60;

export interface SeatLockResult {
  tripId: string;
  seatNumber: string;
  lockedBy: string;
  expiresAt: Date;
}

export async function lockSeat(
  tripId: string,
  seatNumber: string,
  userId: string
): Promise<SeatLockResult> {
  const seat = await findSeatByTripAndNumber(tripId, seatNumber);
  if (!seat) {
    throw ApiError.notFound("Seat not found");
  }
  if (seat.status === SeatStatus.BOOKED) {
    throw ApiError.conflict("Seat is already booked");
  }

  const acquired = await acquireSeatLock(tripId, seatNumber, userId, SEAT_LOCK_TTL_SECONDS);

  let ttlSeconds = SEAT_LOCK_TTL_SECONDS;
  if (!acquired) {
    const currentOwner = await getSeatLockOwner(tripId, seatNumber);
    if (currentOwner !== userId) {
      throw ApiError.conflict("Seat is currently locked by another user");
    }
    ttlSeconds = await getSeatLockTtlSeconds(tripId, seatNumber);
  }

  return {
    tripId,
    seatNumber,
    lockedBy: userId,
    expiresAt: new Date(Date.now() + ttlSeconds * 1000),
  };
}

export async function unlockSeat(
  tripId: string,
  seatNumber: string,
  userId: string
): Promise<void> {
  await releaseSeatLock(tripId, seatNumber, userId);
}

export interface SeatMapEntry {
  seatNumber: string;
  deck?: Deck;
  status: SeatStatus;
}

export async function getSeatMap(tripId: string): Promise<SeatMapEntry[]> {
  const trip = await findTripById(tripId);
  if (!trip) {
    throw ApiError.notFound("Trip not found");
  }

  const seats = await findSeatsByTrip(tripId);
  const seatNumbers = seats.map((seat) => seat.seatNumber);
  const lockOwners = await getSeatLockOwners(tripId, seatNumbers);

  return seats.map((seat, index) => {
    if (seat.status === SeatStatus.BOOKED) {
      return { seatNumber: seat.seatNumber, deck: seat.deck, status: SeatStatus.BOOKED };
    }
    const status = lockOwners[index] ? SeatStatus.LOCKED : SeatStatus.AVAILABLE;
    return { seatNumber: seat.seatNumber, deck: seat.deck, status };
  });
}
