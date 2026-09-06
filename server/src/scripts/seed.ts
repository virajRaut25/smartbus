import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";
import { Operator } from "../models/operator.model.js";
import { Bus } from "../models/bus.model.js";
import { Route } from "../models/route.model.js";
import { Trip } from "../models/trip.model.js";
import { BusType, TripStatus } from "../types/enums.js";

function atHour(daysFromNow: number, hour: number, minute = 0): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);
  return date;
}

async function seed(): Promise<void> {
  await connectDatabase();

  await Promise.all([
    Operator.deleteMany({}),
    Bus.deleteMany({}),
    Route.deleteMany({}),
    Trip.deleteMany({}),
  ]);

  const operator = await Operator.create({
    name: "Star Express Travels",
    contactEmail: "contact@starexpress.example",
    contactPhone: "+91-9800000000",
  });

  const [sleeperBus, seaterBus] = await Bus.create([
    {
      operatorId: operator._id,
      registrationNumber: "MH12AB1234",
      name: "Star Express Sleeper",
      busType: BusType.AC_SLEEPER,
      totalSeats: 36,
      amenities: ["AC", "WiFi", "Charging Point", "Blanket"],
    },
    {
      operatorId: operator._id,
      registrationNumber: "MH14CD5678",
      name: "Star Express Seater",
      busType: BusType.AC_SEATER,
      totalSeats: 45,
      amenities: ["AC", "WiFi", "Charging Point"],
    },
  ]);

  const route = await Route.create({
    source: "Mumbai",
    destination: "Pune",
    distanceKm: 150,
    estimatedDurationMinutes: 210,
    boardingPoints: [
      { name: "Dadar", distanceFromSourceKm: 8 },
      { name: "Vashi", distanceFromSourceKm: 25 },
    ],
    alightingPoints: [
      { name: "Wakad", distanceFromSourceKm: 135 },
      { name: "Swargate", distanceFromSourceKm: 148 },
    ],
  });

  await Trip.create([
    {
      routeId: route._id,
      busId: sleeperBus._id,
      operatorId: operator._id,
      departureTime: atHour(1, 21, 0),
      arrivalTime: atHour(2, 0, 30),
      fare: 800,
      status: TripStatus.SCHEDULED,
      availableSeatsCount: sleeperBus.totalSeats,
    },
    {
      routeId: route._id,
      busId: seaterBus._id,
      operatorId: operator._id,
      departureTime: atHour(1, 9, 0),
      arrivalTime: atHour(1, 12, 30),
      fare: 500,
      status: TripStatus.SCHEDULED,
      availableSeatsCount: seaterBus.totalSeats,
    },
    {
      routeId: route._id,
      busId: sleeperBus._id,
      operatorId: operator._id,
      departureTime: atHour(2, 21, 0),
      arrivalTime: atHour(3, 0, 30),
      fare: 850,
      status: TripStatus.SCHEDULED,
      availableSeatsCount: sleeperBus.totalSeats,
    },
    {
      routeId: route._id,
      busId: seaterBus._id,
      operatorId: operator._id,
      departureTime: atHour(2, 8, 0),
      arrivalTime: atHour(2, 11, 30),
      fare: 480,
      status: TripStatus.SCHEDULED,
      availableSeatsCount: seaterBus.totalSeats,
    },
  ]);

  console.log("Seed complete: 1 operator, 2 buses, 1 route, 4 trips");
}

try {
  await seed();
} catch (error) {
  console.error("Seed failed:", error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
