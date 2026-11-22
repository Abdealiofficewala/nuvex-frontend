"use client";

import { ThemePreviewPanel } from "@/components/admin/appearance/ThemePreviewPanel";

type ThemePreviewLoaderProps = {
  id: string;
};

export function ThemePreviewLoader({ id }: ThemePreviewLoaderProps) {
  return <ThemePreviewPanel themeId={id} />;
}
