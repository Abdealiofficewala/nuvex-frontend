"use client";

import { cn } from "@/lib/utils";

type AdminMapPreviewProps = {
  query: string;
  title: string;
  emptyText: string;
  compact?: boolean;
};

export function AdminMapPreview({ query, title, emptyText, compact = false }: AdminMapPreviewProps) {
  const trimmed = query?.trim() ?? "";

  if (!trimmed) {
    return (
      <div className={cn("admin-map-preview admin-map-preview--empty", compact && "admin-map-preview--compact")}>
        <span className="admin-map-preview__pin" aria-hidden="true" />
        <p>{emptyText}</p>
      </div>
    );
  }

  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&z=15&output=embed`;

  return (
    <div className={cn("admin-map-preview", compact && "admin-map-preview--compact")}>
      <iframe title={title} src={embedSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}
