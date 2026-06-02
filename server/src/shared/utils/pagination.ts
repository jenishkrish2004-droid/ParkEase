// ============================================================
// Pagination Utilities
// ============================================================

import type { IPaginationMeta, IPaginationQuery } from '@parkease/shared';

export interface PaginationParams {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

/** Parse pagination query params into Prisma-compatible skip/take */
export function parsePagination(query: IPaginationQuery): PaginationParams {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(50, Math.max(1, query.limit ?? 20));

  return {
    skip: (page - 1) * limit,
    take: limit,
    page,
    limit,
  };
}

/** Build pagination metadata from count and params */
export function buildPaginationMeta(total: number, params: PaginationParams): IPaginationMeta {
  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages: Math.ceil(total / params.limit),
  };
}
