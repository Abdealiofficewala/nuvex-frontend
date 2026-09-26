import { APPEARANCE_UPDATED_EVENT } from "@/lib/constants";
import type {
  BrandingInput,
  BrandingRecord,
  ColorPaletteInput,
  ColorPaletteRecord,
  ResolvedTheme,
  ThemeInput,
  ThemeRecord,
} from "@/types/appearance";

type ApiEnvelope<T> = {
  data: T;
};

type ThemeListItem = ThemeRecord & {
  resolved: ResolvedTheme;
};

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    credentials: "include",
  });

  const payload = (await response.json()) as ApiEnvelope<T> | { error?: { message?: string } };

  if (!response.ok) {
    const message =
      "error" in payload && payload.error?.message
        ? payload.error.message
        : "Request failed";
    throw new Error(message);
  }

  return (payload as ApiEnvelope<T>).data;
}

function notifyAppearanceUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(APPEARANCE_UPDATED_EVENT));
  }
}

export const appearanceService = {
  getActiveTheme() {
    return request<ResolvedTheme | null>("/api/theme/active");
  },

  listThemes() {
    return request<ThemeListItem[]>("/api/admin/appearance/themes");
  },

  getTheme(id: string) {
    return request<{ theme: ThemeRecord; resolved: ResolvedTheme }>(
      `/api/admin/appearance/themes/${encodeURIComponent(id)}`,
    );
  },

  createTheme(input: ThemeInput) {
    return request<ThemeRecord>("/api/admin/appearance/themes", {
      method: "POST",
      body: JSON.stringify(input),
    }).then((result) => {
      notifyAppearanceUpdated();
      return result;
    });
  },

  updateTheme(id: string, input: Partial<ThemeInput>) {
    return request<ThemeRecord>(`/api/admin/appearance/themes/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }).then((result) => {
      notifyAppearanceUpdated();
      return result;
    });
  },

  activateTheme(id: string) {
    return request<{ theme: ThemeRecord; resolved: ResolvedTheme }>(
      `/api/admin/appearance/themes/${encodeURIComponent(id)}/activate`,
      { method: "POST" },
    ).then((result) => {
      notifyAppearanceUpdated();
      return result;
    });
  },

  duplicateTheme(id: string, input?: { name: string; slug: string }) {
    return request<ThemeRecord>(
      `/api/admin/appearance/themes/${encodeURIComponent(id)}/duplicate`,
      {
        method: "POST",
        body: JSON.stringify(input ?? {}),
      },
    ).then((result) => {
      notifyAppearanceUpdated();
      return result;
    });
  },

  deleteTheme(id: string) {
    return request<{ ok: boolean }>(`/api/admin/appearance/themes/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).then((result) => {
      notifyAppearanceUpdated();
      return result;
    });
  },

  listBranding() {
    return request<BrandingRecord[]>("/api/admin/appearance/branding");
  },

  createBranding(input: BrandingInput) {
    return request<BrandingRecord>("/api/admin/appearance/branding", {
      method: "POST",
      body: JSON.stringify(input),
    }).then((result) => {
      notifyAppearanceUpdated();
      return result;
    });
  },

  updateBranding(id: string, input: Partial<BrandingInput>) {
    return request<BrandingRecord>(`/api/admin/appearance/branding/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }).then((result) => {
      notifyAppearanceUpdated();
      return result;
    });
  },

  deleteBranding(id: string) {
    return request<{ ok: boolean }>(`/api/admin/appearance/branding/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).then((result) => {
      notifyAppearanceUpdated();
      return result;
    });
  },

  listColorPalettes() {
    return request<ColorPaletteRecord[]>("/api/admin/appearance/color-palettes");
  },

  createColorPalette(input: ColorPaletteInput) {
    return request<ColorPaletteRecord>("/api/admin/appearance/color-palettes", {
      method: "POST",
      body: JSON.stringify(input),
    }).then((result) => {
      notifyAppearanceUpdated();
      return result;
    });
  },

  updateColorPalette(id: string, input: Partial<ColorPaletteInput>) {
    return request<ColorPaletteRecord>(
      `/api/admin/appearance/color-palettes/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(input),
      },
    ).then((result) => {
      notifyAppearanceUpdated();
      return result;
    });
  },

  deleteColorPalette(id: string) {
    return request<{ ok: boolean }>(
      `/api/admin/appearance/color-palettes/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    ).then((result) => {
      notifyAppearanceUpdated();
      return result;
    });
  },
};
