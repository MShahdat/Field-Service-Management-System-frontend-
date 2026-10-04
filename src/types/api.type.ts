export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: Meta;
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  search?: string;
  sortOrder?: string;
  sortBy?: string;
  limit?: string;
  page?: string;
  [key: string]: any;
}
