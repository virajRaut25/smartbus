import { searchResultsKey } from "../redis/keys.js";
import { getCachedSearchResults, setCachedSearchResults } from "../repositories/searchCache.repository.js";
import { searchTrips as searchTripsInDb } from "../repositories/trip.repository.js";
import type { SearchTripsParams, SearchTripsResult } from "../repositories/trip.repository.js";

const SEARCH_CACHE_TTL_SECONDS = 60;

export async function searchTrips(params: SearchTripsParams): Promise<SearchTripsResult> {
  const cacheKey = searchResultsKey(params);

  const cached = await getCachedSearchResults(cacheKey);
  if (cached) {
    return cached;
  }

  const result = await searchTripsInDb(params);
  await setCachedSearchResults(cacheKey, result, SEARCH_CACHE_TTL_SECONDS);

  return result;
}
