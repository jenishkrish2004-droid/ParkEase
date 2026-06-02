// ============================================================
// Standardized API Response Types
// ============================================================

/** Pagination metadata */
export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Successful API response */
export interface IApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: IPaginationMeta;
}

/** Error detail for validation errors */
export interface IValidationErrorDetail {
  field: string;
  message: string;
}

/** Error API response */
export interface IApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: IValidationErrorDetail[];
  };
}

/** Union of all API responses */
export type IApiResponse<T = unknown> = IApiSuccessResponse<T> | IApiErrorResponse;

// ============================================================
// API Request Types
// ============================================================

/** Standard pagination query params */
export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Search query params */
export interface ISearchQuery extends IPaginationQuery {
  q?: string;
}
