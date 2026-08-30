export type ApiSuccess<T> = {
  data: T;
  message?: string;
};

export type ApiErrorBody = {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type ApiListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};
