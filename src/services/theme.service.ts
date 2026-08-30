import { mockTheme } from "@/data/mock/theme";
import { normalizeTheme } from "@/lib/theme";
import { axiosClient, withMockFallback } from "@/services/api/axios-client";
import { endpoints } from "@/services/api/endpoints";
import type { ThemeTokens } from "@/types/theme";

export const themeService = {
  getTheme() {
    return withMockFallback(async () => {
      const { data } = await axiosClient.get<Partial<ThemeTokens>>(endpoints.theme);
      return normalizeTheme(data);
    }, mockTheme);
  },
};
