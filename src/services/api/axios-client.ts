import axios from "axios";
import { env, isDevelopment } from "@/config/env";
import { attachInterceptors } from "@/services/api/interceptors";

export const axiosClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

attachInterceptors(axiosClient);

export async function withMockFallback<T>(requestFn: () => Promise<T>, mockValue: T): Promise<T> {
  try {
    return await requestFn();
  } catch (error) {
    if (isDevelopment) {
      return mockValue;
    }

    throw error;
  }
}
