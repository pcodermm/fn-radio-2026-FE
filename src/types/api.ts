export type ValidationErrors = Record<string, string[]>;

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  has_more_pages: boolean;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  pagination: Pagination;
  links: PaginationLinks;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ValidationErrors;
}

export interface PaginatedResult<T> {
  items: T[];
  message: string;
  meta: PaginationMeta;
}

export interface ListQueryParams {
  category?: string;
  featured?: boolean;
  search?: string;
  page?: number;
}
