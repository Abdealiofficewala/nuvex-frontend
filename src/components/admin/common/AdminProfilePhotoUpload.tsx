"use client";

import { AdminFormImageUpload, type AdminFormImageUploadProps } from "@/components/admin/common/AdminFormImageUpload";
import { ADMIN_USER_IMAGE_UPLOAD_CONSTRAINTS } from "@/lib/image-upload.config";
import { cn } from "@/lib/utils";

export type AdminProfilePhotoUploadProps = Omit<AdminFormImageUploadProps, "variant" | "size"> & {
  placeholderInitials?: string;
};

/** Profile photo field — compact avatar upload with theme styling (user / team forms). */
export function AdminProfilePhotoUpload({
  constraints = ADMIN_USER_IMAGE_UPLOAD_CONSTRAINTS,
  placeholderInitials,
  className,
  ...props
}: AdminProfilePhotoUploadProps) {
  return (
    <AdminFormImageUpload
      {...props}
      variant="profile"
      size="compact"
      constraints={constraints}
      placeholderInitials={placeholderInitials}
      className={cn("admin-profile-photo-upload", className)}
    />
  );
}
