import { z } from "zod";
import { BusType } from "../types/enums.js";

export const searchQuerySchema = z.object({
  from: z.string().trim().min(1, "from is required"),
  to: z.string().trim().min(1, "to is required"),
  date: z.coerce.date("date must be a valid date"),
  operatorId: z.string().trim().optional(),
  busType: z.enum(BusType).optional(),
  minFare: z.coerce.number().min(0).optional(),
  maxFare: z.coerce.number().min(0).optional(),
  amenities: z
    .string()
    .trim()
    .optional()
    .transform((value) =>
      value ? value.split(",").map((item) => item.trim()).filter(Boolean) : undefined
    ),
  sortBy: z.enum(["fare", "departureTime"]).default("departureTime"),
  order: z.enum(["asc", "desc"]).default("asc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
