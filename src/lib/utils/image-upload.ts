import {
  DEFAULT_IMAGE_UPLOAD_CONSTRAINTS,
  type ImageUploadConstraints,
  type ImageUploadHintLabels,
} from "@/lib/image-upload.config";

export type { ImageUploadConstraints, ImageUploadHintLabels } from "@/lib/image-upload.config";
export {
  DEFAULT_IMAGE_UPLOAD_CONSTRAINTS,
  resolveImageUploadConstraints,
} from "@/lib/image-upload.config";

export type ImageUploadValidationError = "invalidType" | "tooLarge";

export const DEFAULT_IMAGE_MAX_SIZE_BYTES = DEFAULT_IMAGE_UPLOAD_CONSTRAINTS.maxSizeBytes;

export function parseAcceptList(accept: string): string[] {
  return accept
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function isAcceptedImageFile(file: File, accept = DEFAULT_IMAGE_UPLOAD_CONSTRAINTS.accept): boolean {
  const allowed = parseAcceptList(accept);
  const extension = file.name.split(".").pop()?.toLowerCase();

  return allowed.some((type) => {
    if (type.startsWith(".")) {
      return extension === type.slice(1).toLowerCase();
    }

    if (type.endsWith("/*")) {
      return file.type.startsWith(type.replace("/*", "/"));
    }

    return file.type === type;
  });
}

export function validateImageFile(
  file: File,
  constraints: Partial<ImageUploadConstraints> = {},
): ImageUploadValidationError | null {
  const { accept, maxSizeBytes } = {
    accept: constraints.accept ?? DEFAULT_IMAGE_UPLOAD_CONSTRAINTS.accept,
    maxSizeBytes: constraints.maxSizeBytes ?? DEFAULT_IMAGE_UPLOAD_CONSTRAINTS.maxSizeBytes,
  };

  if (!isAcceptedImageFile(file, accept)) {
    return "invalidType";
  }

  if (file.size > maxSizeBytes) {
    return "tooLarge";
  }

  return null;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("invalid-result"));
    };

    reader.onerror = () => reject(reader.error ?? new Error("read-failed"));
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  }

  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${bytes} B`;
}

export function formatImageUploadHint(
  constraints: ImageUploadConstraints,
  labels: ImageUploadHintLabels = {},
): string {
  if (labels.hint?.trim()) {
    return labels.hint.trim();
  }

  if (labels.types?.trim()) {
    return labels.types.trim();
  }

  return `JPG, PNG, WebP, or GIF up to ${formatFileSize(constraints.maxSizeBytes)}`;
}
