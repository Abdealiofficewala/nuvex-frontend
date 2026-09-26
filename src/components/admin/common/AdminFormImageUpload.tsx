"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  AdminImageUpload,
  type AdminImageUploadProps,
} from "@/components/admin/common/AdminImageUpload";
import { buildAdminFormImageUploadCopy } from "@/lib/admin-image-upload-labels";
import {
  DEFAULT_IMAGE_UPLOAD_CONSTRAINTS,
  resolveImageUploadConstraints,
  type ImageUploadConstraints,
} from "@/lib/image-upload.config";
import { cn } from "@/lib/utils";

export type AdminFormImageUploadProps = Omit<
  AdminImageUploadProps,
  "labels" | "uploadErrorMessages" | "constraints" | "size"
> & {
  constraints?: Partial<ImageUploadConstraints>;
  size?: AdminImageUploadProps["size"];
};

export function AdminFormImageUpload({
  constraints,
  variant = "logo",
  size = "compact",
  className,
  ...props
}: AdminFormImageUploadProps) {
  const t = useTranslations("admin.common.imageUpload");
  const resolvedConstraints = resolveImageUploadConstraints(
    constraints ?? DEFAULT_IMAGE_UPLOAD_CONSTRAINTS,
  );
  const copy = useMemo(
    () => buildAdminFormImageUploadCopy((key) => t(key as Parameters<typeof t>[0]), resolvedConstraints),
    [resolvedConstraints, t],
  );

  return (
    <AdminImageUpload
      {...props}
      variant={variant}
      size={size}
      className={cn("admin-form-image-upload", className)}
      constraints={resolvedConstraints}
      labels={copy.labels}
      uploadErrorMessages={copy.uploadErrorMessages}
    />
  );
}
