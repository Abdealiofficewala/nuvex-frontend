import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { createSeedAppearanceStore } from "@/data/theme/seed";
import {
  DEFAULT_DESIGN,
  DEFAULT_GLOBAL_APPEARANCE_SETTINGS,
  DEFAULT_THEME_APPEARANCE,
  DEFAULT_THEME_SCHEDULE,
} from "@/lib/appearance/defaults";
import { normalizeThemeSchedule } from "@/lib/appearance/schedule";
import { getActiveTheme, resolveTheme } from "@/lib/appearance/resolve-theme";
import { normalizeSlug, uniqueSlug } from "@/lib/appearance/slug";
import {
  hasValidationErrors,
  validateBrandingInput,
  validateColorPaletteInput,
  validateThemeInput,
} from "@/lib/appearance/validation";
import type {
  AppearanceStore,
  BrandingInput,
  BrandingRecord,
  ColorPaletteInput,
  ColorPaletteRecord,
  ResolvedTheme,
  ThemeDesignConfig,
  ThemeInput,
  ThemeRecord,
} from "@/types/appearance";

const STORE_PATH = path.join(process.cwd(), "data", "appearance-store.json");

let writeQueue: Promise<void> = Promise.resolve();
let seedBootstrapPromise: Promise<AppearanceStore> | null = null;

function nowIso() {
  return new Date().toISOString();
}

function createEmptyStore(): AppearanceStore {
  return createSeedAppearanceStore();
}

function normalizeStore(parsed: Partial<AppearanceStore> & { typography?: unknown }): AppearanceStore {
  const seed = createSeedAppearanceStore();
  const { typography: _typography, ...rest } = parsed;

  const themes = (rest.themes ?? seed.themes).map((theme) => {
    const record = theme as ThemeRecord;

    return {
      ...record,
      isFallback: record.isFallback ?? false,
      disabled: record.disabled ?? false,
      typographyId: record.typographyId ?? seed.typographyPresets[0]?.id ?? null,
      appearance: record.appearance ?? { ...DEFAULT_THEME_APPEARANCE },
      schedule: normalizeThemeSchedule(record.schedule),
    };
  });

  return {
    themes,
    branding: rest.branding?.length ? rest.branding : seed.branding,
    colorPalettes: rest.colorPalettes?.length ? rest.colorPalettes : seed.colorPalettes,
    typographyPresets: rest.typographyPresets?.length ? rest.typographyPresets : seed.typographyPresets,
    fonts: rest.fonts?.length ? rest.fonts : seed.fonts,
    settings: rest.settings ?? seed.settings ?? { ...DEFAULT_GLOBAL_APPEARANCE_SETTINGS },
  };
}

function isValidStore(parsed: AppearanceStore | null | undefined): parsed is AppearanceStore {
  return Boolean(
    parsed &&
      Array.isArray(parsed.themes) &&
      Array.isArray(parsed.branding) &&
      Array.isArray(parsed.colorPalettes) &&
      Array.isArray(parsed.typographyPresets) &&
      Array.isArray(parsed.fonts),
  );
}

async function bootstrapSeedStore(): Promise<AppearanceStore> {
  if (!seedBootstrapPromise) {
    const seed = createSeedAppearanceStore();
    seedBootstrapPromise = writeStoreFile(seed).then(() => seed);
  }

  return seedBootstrapPromise;
}

async function readStoreFile(): Promise<AppearanceStore> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as AppearanceStore;

    if (!isValidStore(parsed)) {
      return bootstrapSeedStore();
    }

    return normalizeStore(parsed);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)?.code;
    if (code === "ENOENT") {
      return bootstrapSeedStore();
    }

    return bootstrapSeedStore();
  }
}

async function writeStoreFile(store: AppearanceStore) {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function enforceSingleActiveTheme(store: AppearanceStore): AppearanceStore {
  const activeThemes = store.themes.filter((theme) => theme.isActive);

  if (activeThemes.length <= 1) {
    return store;
  }

  const keepId = activeThemes[0]?.id;
  return {
    ...store,
    themes: store.themes.map((theme) => ({
      ...theme,
      isActive: theme.id === keepId,
    })),
  };
}

async function withStore<T>(mutator: (store: AppearanceStore) => T | Promise<T>): Promise<T> {
  const run = async () => {
    const current = enforceSingleActiveTheme(await readStoreFile());
    const result = await mutator(current);
    return result;
  };

  const result = await run();
  return result;
}

async function withStoreWrite<T>(
  mutator: (store: AppearanceStore) => { store: AppearanceStore; result: T },
): Promise<T> {
  let output!: T;

  writeQueue = writeQueue.then(async () => {
    const current = enforceSingleActiveTheme(await readStoreFile());
    const { store, result } = mutator(current);
    const normalized = enforceSingleActiveTheme(store);
    await writeStoreFile(normalized);
    output = result;
  });

  await writeQueue;
  return output;
}

export async function getAppearanceStore(): Promise<AppearanceStore> {
  return withStore(async (store) => store);
}

export async function getActiveResolvedTheme(): Promise<ResolvedTheme | null> {
  const store = await getAppearanceStore();
  return getActiveTheme(store);
}

export async function listThemes() {
  const store = await getAppearanceStore();
  return store.themes.map((theme) => ({
    ...theme,
    resolved: resolveTheme(store, theme),
  }));
}

export async function getThemeById(id: string) {
  const store = await getAppearanceStore();
  const theme = store.themes.find((item) => item.id === id);
  if (!theme) {
    throw new Error("not-found");
  }

  return {
    theme,
    resolved: resolveTheme(store, theme),
  };
}

export async function createTheme(input: ThemeInput, createdBy?: string | null) {
  return withStoreWrite((store) => {
    const slug = normalizeSlug(input.slug || input.name);
    const errors = validateThemeInput({ ...input, slug }, store.themes.map((item) => item.slug));

    if (hasValidationErrors(errors)) {
      throw new Error("validation");
    }

    if (!store.branding.some((item) => item.id === input.brandingId)) {
      throw new Error("validation");
    }

    if (!store.colorPalettes.some((item) => item.id === input.colorPaletteId)) {
      throw new Error("validation");
    }

    const typographyId = input.typographyId ?? store.typographyPresets[0]?.id ?? null;
    if (typographyId && !store.typographyPresets.some((item) => item.id === typographyId)) {
      throw new Error("validation");
    }

    const timestamp = nowIso();
    const theme: ThemeRecord = {
      id: randomUUID(),
      name: input.name.trim(),
      slug,
      description: input.description?.trim() ?? "",
      isActive: false,
      isFallback: false,
      disabled: input.disabled ?? false,
      brandingId: input.brandingId,
      colorPaletteId: input.colorPaletteId,
      typographyId: input.typographyId ?? store.typographyPresets[0]?.id ?? null,
      schedule: normalizeThemeSchedule(input.schedule),
      appearance: input.appearance ?? { ...DEFAULT_THEME_APPEARANCE },
      design: input.design ?? structuredClone(DEFAULT_DESIGN),
      createdBy: createdBy ?? null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return {
      store: { ...store, themes: [...store.themes, theme] },
      result: theme,
    };
  });
}

export async function updateTheme(id: string, input: Partial<ThemeInput>) {
  return withStoreWrite((store) => {
    const index = store.themes.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("not-found");
    }

    const current = store.themes[index]!;
    const slug = normalizeSlug(input.slug ?? current.slug);
    const otherSlugs = store.themes.filter((item) => item.id !== id).map((item) => item.slug);
    const merged: ThemeInput = {
      name: input.name?.trim() ?? current.name,
      slug,
      description: input.description?.trim() ?? current.description,
      brandingId: input.brandingId ?? current.brandingId,
      colorPaletteId: input.colorPaletteId ?? current.colorPaletteId,
      typographyId: input.typographyId ?? current.typographyId,
      schedule: normalizeThemeSchedule(input.schedule ?? current.schedule),
      appearance: input.appearance ?? current.appearance,
      disabled: input.disabled ?? current.disabled,
      design: input.design ?? current.design,
    };

    const errors = validateThemeInput(merged, otherSlugs, { themeId: id });
    if (hasValidationErrors(errors)) {
      throw new Error("validation");
    }

    const updated: ThemeRecord = {
      ...current,
      ...merged,
      schedule: merged.schedule ?? current.schedule ?? { ...DEFAULT_THEME_SCHEDULE },
      updatedAt: nowIso(),
    };

    const themes = [...store.themes];
    themes[index] = updated;

    return {
      store: { ...store, themes },
      result: updated,
    };
  });
}

export async function activateTheme(id: string) {
  return withStoreWrite((store) => {
    const exists = store.themes.some((item) => item.id === id);
    if (!exists) {
      throw new Error("not-found");
    }

    const themes = store.themes.map((theme) => ({
      ...theme,
      isActive: theme.id === id,
      updatedAt: theme.id === id ? nowIso() : theme.updatedAt,
    }));

    const active = themes.find((theme) => theme.id === id)!;

    return {
      store: { ...store, themes },
      result: active,
    };
  });
}

export async function duplicateTheme(
  id: string,
  createdBy?: string | null,
  options?: { name?: string; slug?: string },
) {
  return withStoreWrite((store) => {
    const source = store.themes.find((item) => item.id === id);
    if (!source) {
      throw new Error("not-found");
    }

    const timestamp = nowIso();
    const requestedName = options?.name?.trim() || `${source.name} (Copy)`;
    const requestedSlug = normalizeSlug(options?.slug?.trim() || `${source.slug}-copy`);
    const slug = uniqueSlug(requestedSlug, store.themes.map((item) => item.slug));

    const duplicate: ThemeRecord = {
      ...structuredClone(source),
      id: randomUUID(),
      name: requestedName,
      slug,
      isActive: false,
      createdBy: createdBy ?? null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return {
      store: { ...store, themes: [...store.themes, duplicate] },
      result: duplicate,
    };
  });
}

export async function deleteTheme(id: string) {
  return withStoreWrite((store) => {
    const theme = store.themes.find((item) => item.id === id);
    if (!theme) {
      throw new Error("not-found");
    }

    if (theme.isActive) {
      throw new Error("active-theme");
    }

    return {
      store: {
        ...store,
        themes: store.themes.filter((item) => item.id !== id),
      },
      result: true,
    };
  });
}

export async function listBranding() {
  const store = await getAppearanceStore();
  return store.branding;
}

export async function getBrandingById(id: string) {
  const store = await getAppearanceStore();
  const branding = store.branding.find((item) => item.id === id);

  if (!branding) {
    throw new Error("not-found");
  }

  return branding;
}

export async function createBranding(input: BrandingInput) {
  return withStoreWrite((store) => {
    const slug = normalizeSlug(input.slug || input.name);
    const errors = validateBrandingInput(
      { ...input, slug },
      store.branding.map((item) => item.slug),
    );

    if (hasValidationErrors(errors)) {
      throw new Error("validation");
    }

    const timestamp = nowIso();
    const record: BrandingRecord = {
      id: randomUUID(),
      name: input.name.trim(),
      slug,
      logo: input.logo?.trim() ?? "",
      logoDark: input.logoDark?.trim() ?? "",
      logoLight: input.logoLight?.trim() ?? "",
      mobileLogo: input.mobileLogo?.trim() ?? "",
      favicon: input.favicon?.trim() ?? "",
      applicationName: input.applicationName?.trim() || input.name.trim(),
      brandName: input.brandName?.trim() || input.name.trim(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return {
      store: { ...store, branding: [...store.branding, record] },
      result: record,
    };
  });
}

export async function updateBranding(id: string, input: Partial<BrandingInput>) {
  return withStoreWrite((store) => {
    const index = store.branding.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("not-found");
    }

    const current = store.branding[index]!;
    const slug = normalizeSlug(input.slug ?? current.slug);
    const otherSlugs = store.branding.filter((item) => item.id !== id).map((item) => item.slug);
    const merged: BrandingInput = {
      name: input.name?.trim() ?? current.name,
      slug,
      logo: input.logo?.trim() ?? current.logo,
      logoDark: input.logoDark?.trim() ?? current.logoDark,
      logoLight: input.logoLight?.trim() ?? current.logoLight,
      mobileLogo: input.mobileLogo?.trim() ?? current.mobileLogo,
      favicon: input.favicon?.trim() ?? current.favicon,
      applicationName: input.applicationName?.trim() ?? input.name?.trim() ?? current.applicationName,
      brandName: input.brandName?.trim() ?? input.name?.trim() ?? current.brandName,
    };

    const errors = validateBrandingInput(merged, otherSlugs);
    if (hasValidationErrors(errors)) {
      throw new Error("validation");
    }

    const updated: BrandingRecord = {
      ...current,
      ...merged,
      updatedAt: nowIso(),
    };

    const branding = [...store.branding];
    branding[index] = updated;

    return {
      store: { ...store, branding },
      result: updated,
    };
  });
}

export async function deleteBranding(id: string) {
  return withStoreWrite((store) => {
    if (!store.branding.some((item) => item.id === id)) {
      throw new Error("not-found");
    }

    if (store.themes.some((theme) => theme.brandingId === id)) {
      throw new Error("in-use");
    }

    return {
      store: {
        ...store,
        branding: store.branding.filter((item) => item.id !== id),
      },
      result: true,
    };
  });
}

export async function listColorPalettes() {
  const store = await getAppearanceStore();
  return store.colorPalettes;
}

export async function getColorPaletteById(id: string) {
  const store = await getAppearanceStore();
  const palette = store.colorPalettes.find((item) => item.id === id);

  if (!palette) {
    throw new Error("not-found");
  }

  return palette;
}

export async function createColorPalette(input: ColorPaletteInput) {
  return withStoreWrite((store) => {
    const slug = normalizeSlug(input.slug || input.name);
    const errors = validateColorPaletteInput(
      { ...input, slug },
      store.colorPalettes.map((item) => item.slug),
    );

    if (hasValidationErrors(errors)) {
      throw new Error("validation");
    }

    const timestamp = nowIso();
    const record: ColorPaletteRecord = {
      id: randomUUID(),
      name: input.name.trim(),
      slug,
      description: input.description?.trim() ?? "",
      colors: input.colors,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    return {
      store: { ...store, colorPalettes: [...store.colorPalettes, record] },
      result: record,
    };
  });
}

export async function updateColorPalette(id: string, input: Partial<ColorPaletteInput>) {
  return withStoreWrite((store) => {
    const index = store.colorPalettes.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("not-found");
    }

    const current = store.colorPalettes[index]!;
    const slug = normalizeSlug(input.slug ?? current.slug);
    const otherSlugs = store.colorPalettes.filter((item) => item.id !== id).map((item) => item.slug);
    const merged: ColorPaletteInput = {
      name: input.name?.trim() ?? current.name,
      slug,
      description: input.description?.trim() ?? current.description,
      colors: input.colors ?? current.colors,
    };

    const errors = validateColorPaletteInput(merged, otherSlugs);
    if (hasValidationErrors(errors)) {
      throw new Error("validation");
    }

    const updated: ColorPaletteRecord = {
      ...current,
      ...merged,
      updatedAt: nowIso(),
    };

    const colorPalettes = [...store.colorPalettes];
    colorPalettes[index] = updated;

    return {
      store: { ...store, colorPalettes },
      result: updated,
    };
  });
}

export async function deleteColorPalette(id: string) {
  return withStoreWrite((store) => {
    if (!store.colorPalettes.some((item) => item.id === id)) {
      throw new Error("not-found");
    }

    if (store.themes.some((theme) => theme.colorPaletteId === id)) {
      throw new Error("in-use");
    }

    return {
      store: {
        ...store,
        colorPalettes: store.colorPalettes.filter((item) => item.id !== id),
      },
      result: true,
    };
  });
}

export async function disableTheme(id: string) {
  return withStoreWrite((store) => {
    const index = store.themes.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("not-found");
    }

    const current = store.themes[index]!;
    if (current.isFallback) {
      throw new Error("validation");
    }

    const updated: ThemeRecord = {
      ...current,
      disabled: true,
      isActive: false,
      updatedAt: nowIso(),
    };

    const themes = [...store.themes];
    themes[index] = updated;

    return { store: { ...store, themes }, result: updated };
  });
}

export async function listFonts() {
  const store = await getAppearanceStore();
  return store.fonts;
}

export async function listTypographyPresets() {
  const store = await getAppearanceStore();
  return store.typographyPresets;
}

export async function getAppearanceSettings() {
  const store = await getAppearanceStore();
  return store.settings;
}

export async function updateAppearanceSettings(
  input: Partial<AppearanceStore["settings"]>,
) {
  return withStoreWrite((store) => {
    const settings = {
      ...store.settings,
      ...input,
    };

    return {
      store: { ...store, settings },
      result: settings,
    };
  });
}

export async function updateTypographyPreset(
  id: string,
  input: Partial<AppearanceStore["typographyPresets"][number]>,
) {
  return withStoreWrite((store) => {
    const index = store.typographyPresets.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new Error("not-found");
    }

    const current = store.typographyPresets[index]!;
    const updated = {
      ...current,
      ...input,
      tokens: input.tokens ?? current.tokens,
      updatedAt: nowIso(),
    };

    const typographyPresets = [...store.typographyPresets];
    typographyPresets[index] = updated;

    return { store: { ...store, typographyPresets }, result: updated };
  });
}

export type ThemeDesignPatch = {
  radius?: Partial<ThemeDesignConfig["radius"]>;
  components?: {
    button?: Partial<ThemeDesignConfig["components"]["button"]>;
  };
};

export async function updateDefaultThemeDesign(input: ThemeDesignPatch) {
  return withStoreWrite((store) => {
    const fallback =
      store.themes.find((theme) => theme.isFallback) ?? store.themes.find((theme) => theme.isActive);

    if (!fallback) {
      throw new Error("not-found");
    }

    const index = store.themes.findIndex((theme) => theme.id === fallback.id);
    const current = store.themes[index]!;
    const design = {
      ...current.design,
      ...input,
      radius: { ...current.design.radius, ...input.radius },
      components: {
        ...current.design.components,
        ...input.components,
        button: {
          ...current.design.components.button,
          ...input.components?.button,
        },
      },
    };

    const updated: ThemeRecord = {
      ...current,
      design,
      updatedAt: nowIso(),
    };

    const themes = [...store.themes];
    themes[index] = updated;

    return { store: { ...store, themes }, result: updated };
  });
}

