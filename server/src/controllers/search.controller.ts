import type { Request, Response } from "express";
import * as searchService from "../services/search.service.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import type { SearchQuery } from "../validators/search.validator.js";

export async function searchBuses(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as SearchQuery;
  const result = await searchService.searchTrips(query);
  sendSuccess(res, 200, "OK", result);
}
