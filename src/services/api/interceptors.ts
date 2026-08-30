import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import type { ApiErrorBody } from "@/types/api";

export class ApiClientError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiClientError";
    this.status = body.status;
    this.errors = body.errors;
  }
}

export function attachInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    config.headers.set("Accept", "application/json");
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<Partial<ApiErrorBody>>) => {
      const status = error.response?.status ?? 0;
      const message = error.response?.data?.message ?? error.message ?? "Request failed";
      throw new ApiClientError({
        message,
        status,
        errors: error.response?.data?.errors,
      });
    },
  );
}
