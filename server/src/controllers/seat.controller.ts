import type { Request, Response } from "express";
import * as seatLockService from "../services/seatLock.service.js";
import { sendSuccess } from "../utils/ApiResponse.js";

export async function getSeatMap(req: Request, res: Response): Promise<void> {
  const tripId = req.params.tripId as string;
  const seatMap = await seatLockService.getSeatMap(tripId);
  sendSuccess(res, 200, "OK", { seats: seatMap });
}

export async function lockSeat(req: Request, res: Response): Promise<void> {
  const tripId = req.params.tripId as string;
  const seatNumber = req.params.seatNumber as string;
  const result = await seatLockService.lockSeat(tripId, seatNumber, req.user!.sub);
  sendSuccess(res, 200, "Seat locked", result);
}

export async function unlockSeat(req: Request, res: Response): Promise<void> {
  const tripId = req.params.tripId as string;
  const seatNumber = req.params.seatNumber as string;
  await seatLockService.unlockSeat(tripId, seatNumber, req.user!.sub);
  sendSuccess(res, 200, "Seat unlocked");
}
