export type ImageUploadConstraints = {
  accept: string;
  maxSizeBytes: number;
};

export const DEFAULT_IMAGE_UPLOAD_CONSTRAINTS: ImageUploadConstraints = {
  accept: "image/jpeg,image/png,image/webp,image/gif",
  maxSizeBytes: 5 * 1024 * 1024,
};

export const TEAM_MEMBER_IMAGE_UPLOAD_CONSTRAINTS: ImageUploadConstraints = {
  accept: "image/jpeg,image/png,.jpg,.jpeg,.png",
  maxSizeBytes: 2 * 1024 * 1024,
};

export const ADMIN_USER_IMAGE_UPLOAD_CONSTRAINTS: ImageUploadConstraints = {
  accept: "image/jpeg,image/png,.jpg,.jpeg,.png",
  maxSizeBytes: 2 * 1024 * 1024,
};

export function resolveImageUploadConstraints(
  constraints?: Partial<ImageUploadConstraints>,
): ImageUploadConstraints {
  return {
    accept: constraints?.accept ?? DEFAULT_IMAGE_UPLOAD_CONSTRAINTS.accept,
    maxSizeBytes: constraints?.maxSizeBytes ?? DEFAULT_IMAGE_UPLOAD_CONSTRAINTS.maxSizeBytes,
  };
}

export type ImageUploadHintLabels = {
  hint?: string;
  types?: string;
};
