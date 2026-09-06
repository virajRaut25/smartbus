import { createHash } from "node:crypto";

export function refreshTokenKey(userId: string, jti: string): string {
  return `refresh:${userId}:${jti}`;
}

export function refreshTokenSetKey(userId: string): string {
  return `refresh:user:${userId}`;
}

export interface SearchCacheKeyParams {
  from: string;
  to: string;
  date: Date;
  operatorId?: string;
  busType?: string;
  minFare?: number;
  maxFare?: number;
  amenities?: string[];
  sortBy: string;
  order: string;
  page: number;
  limit: number;
}

export function searchResultsKey(params: SearchCacheKeyParams): string {
  const canonical = {
    from: params.from,
    to: params.to,
    date: params.date.toISOString().slice(0, 10),
    operatorId: params.operatorId,
    busType: params.busType,
    minFare: params.minFare,
    maxFare: params.maxFare,
    amenities: params.amenities ? [...params.amenities].sort() : undefined,
    sortBy: params.sortBy,
    order: params.order,
    page: params.page,
    limit: params.limit,
  };

  const hash = createHash("sha256")
    .update(JSON.stringify(canonical, Object.keys(canonical).sort()))
    .digest("hex");

  return `search:trips:${hash}`;
}
