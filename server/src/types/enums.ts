export const Role = {
  PASSENGER: "PASSENGER",
  OPERATOR: "OPERATOR",
  ADMIN: "ADMIN",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

export const BusType = {
  SEATER: "SEATER",
  SLEEPER: "SLEEPER",
  AC_SEATER: "AC_SEATER",
  AC_SLEEPER: "AC_SLEEPER",
} as const;
export type BusType = (typeof BusType)[keyof typeof BusType];

export const Deck = {
  LOWER: "LOWER",
  UPPER: "UPPER",
} as const;
export type Deck = (typeof Deck)[keyof typeof Deck];

export const SeatStatus = {
  AVAILABLE: "AVAILABLE",
  LOCKED: "LOCKED",
  BOOKED: "BOOKED",
} as const;
export type SeatStatus = (typeof SeatStatus)[keyof typeof SeatStatus];

export const BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
} as const;
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export const PaymentStatus = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentMethod = {
  MOCK: "MOCK",
  CARD: "CARD",
  UPI: "UPI",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const TripStatus = {
  SCHEDULED: "SCHEDULED",
  DEPARTED: "DEPARTED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type TripStatus = (typeof TripStatus)[keyof typeof TripStatus];
