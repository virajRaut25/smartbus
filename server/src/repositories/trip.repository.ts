import { Trip, type ITrip } from "../models/trip.model.js";
import { Route, type IRoute } from "../models/route.model.js";
import { Bus } from "../models/bus.model.js";
import { TripStatus, type BusType } from "../types/enums.js";

export interface SearchTripsParams {
  from: string;
  to: string;
  date: Date;
  operatorId?: string;
  busType?: BusType;
  minFare?: number;
  maxFare?: number;
  amenities?: string[];
  sortBy: "fare" | "departureTime";
  order: "asc" | "desc";
  page: number;
  limit: number;
}

export interface SearchTripsResult {
  trips: ITrip[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function startOfDay(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

function endOfDay(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

const EMPTY_RESULT = (page: number, limit: number): SearchTripsResult => ({
  trips: [],
  total: 0,
  page,
  limit,
  totalPages: 0,
});

function boardingDistanceKm(route: IRoute, from: string): number | null {
  if (route.source === from) return 0;
  const point = route.boardingPoints.find((p) => p.name === from);
  return point ? point.distanceFromSourceKm : null;
}

function alightingDistanceKm(route: IRoute, to: string): number | null {
  if (route.destination === to) return route.distanceKm ?? Number.POSITIVE_INFINITY;
  const point = route.alightingPoints.find((p) => p.name === to);
  return point ? point.distanceFromSourceKm : null;
}

export async function searchTrips(params: SearchTripsParams): Promise<SearchTripsResult> {
  const candidateRoutes = await Route.find({
    $and: [
      { $or: [{ source: params.from }, { "boardingPoints.name": params.from }] },
      { $or: [{ destination: params.to }, { "alightingPoints.name": params.to }] },
    ],
  });

  const routeIds = candidateRoutes
    .filter((route) => {
      const boardAt = boardingDistanceKm(route, params.from);
      const alightAt = alightingDistanceKm(route, params.to);
      return boardAt !== null && alightAt !== null && boardAt < alightAt;
    })
    .map((route) => route._id);

  if (routeIds.length === 0) {
    return EMPTY_RESULT(params.page, params.limit);
  }

  const tripFilter: Record<string, unknown> = {
    routeId: { $in: routeIds },
    departureTime: { $gte: startOfDay(params.date), $lte: endOfDay(params.date) },
    status: TripStatus.SCHEDULED,
  };

  if (params.operatorId) {
    tripFilter.operatorId = params.operatorId;
  }

  if (params.minFare !== undefined || params.maxFare !== undefined) {
    const fareFilter: Record<string, number> = {};
    if (params.minFare !== undefined) fareFilter.$gte = params.minFare;
    if (params.maxFare !== undefined) fareFilter.$lte = params.maxFare;
    tripFilter.fare = fareFilter;
  }

  if (params.busType || (params.amenities && params.amenities.length > 0)) {
    const busFilter: Record<string, unknown> = {};
    if (params.busType) busFilter.busType = params.busType;
    if (params.amenities && params.amenities.length > 0) {
      busFilter.amenities = { $all: params.amenities };
    }

    const buses = await Bus.find(busFilter).select("_id");
    if (buses.length === 0) {
      return EMPTY_RESULT(params.page, params.limit);
    }
    tripFilter.busId = { $in: buses.map((bus) => bus._id) };
  }

  const sortField = params.sortBy === "fare" ? "fare" : "departureTime";
  const sortDirection = params.order === "desc" ? -1 : 1;
  const skip = (params.page - 1) * params.limit;

  const [trips, total] = await Promise.all([
    Trip.find(tripFilter)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(params.limit)
      .populate("routeId")
      .populate("busId")
      .populate("operatorId"),
    Trip.countDocuments(tripFilter),
  ]);

  return {
    trips,
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit),
  };
}
