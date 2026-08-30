import type { AdminImageUploadLabels } from "@/components/admin/common";
import type { ImageUploadValidationError } from "@/lib/utils/image-upload";

type ImageUploadLabelKey = "drop" | "browse" | "change" | "remove" | "hint";
type ImageUploadErrorKey = "invalidType" | "tooLarge";

/** Build `AdminImageUpload` labels from a scoped translator (`image.*` keys). */
export function buildAdminImageUploadLabels(
  translate: (key: ImageUploadLabelKey) => string,
): AdminImageUploadLabels {
  return {
    drop: translate("drop"),
    browse: translate("browse"),
    change: translate("change"),
    remove: translate("remove"),
    hint: translate("hint"),
  };
}

/** Build upload validation messages from a scoped translator (`image.*` keys). */
export function buildAdminImageUploadErrors(
  translate: (key: ImageUploadErrorKey) => string,
): Partial<Record<ImageUploadValidationError, string>> {
  return {
    invalidType: translate("invalidType"),
    tooLarge: translate("tooLarge"),
  };
}
