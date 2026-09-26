import type { AdminImageUploadLabels } from "@/components/admin/common";
import { ADMIN_USER_IMAGE_UPLOAD_CONSTRAINTS, type ImageUploadConstraints } from "@/lib/image-upload.config";
import { formatImageUploadHint, type ImageUploadValidationError } from "@/lib/utils/image-upload";

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

type CommonImageUploadLabelKey = "drop" | "browse" | "change" | "remove" | "hintJpgPng2Mb";
type CommonImageUploadErrorKey = "invalidTypeJpgPng" | "tooLarge2Mb";

function isProfileImageConstraints(constraints: ImageUploadConstraints) {
  return (
    constraints.maxSizeBytes === ADMIN_USER_IMAGE_UPLOAD_CONSTRAINTS.maxSizeBytes &&
    constraints.accept === ADMIN_USER_IMAGE_UPLOAD_CONSTRAINTS.accept
  );
}

type AdminFormImageUploadCopyKey =
  | ImageUploadLabelKey
  | ImageUploadErrorKey
  | CommonImageUploadLabelKey
  | CommonImageUploadErrorKey;

/** Shared copy for admin form image uploads (`admin.common.imageUpload`). */
export function buildAdminFormImageUploadCopy(
  translate: (key: AdminFormImageUploadCopyKey) => string,
  constraints: ImageUploadConstraints,
) {
  const profilePreset = isProfileImageConstraints(constraints);

  return {
    labels: buildAdminImageUploadLabels((key) => {
      if (key === "hint") {
        return profilePreset ? translate("hintJpgPng2Mb") : formatImageUploadHint(constraints);
      }

      return translate(key);
    }),
    uploadErrorMessages: {
      invalidType: profilePreset ? translate("invalidTypeJpgPng") : translate("invalidType"),
      tooLarge: profilePreset ? translate("tooLarge2Mb") : translate("tooLarge"),
    },
  };
}

/** @deprecated Use buildAdminFormImageUploadCopy */
export function buildCommonAdminImageUploadCopy(
  translate: (key: CommonImageUploadLabelKey | CommonImageUploadErrorKey) => string,
) {
  return buildAdminFormImageUploadCopy(
    (key) => translate(key as CommonImageUploadLabelKey | CommonImageUploadErrorKey),
    ADMIN_USER_IMAGE_UPLOAD_CONSTRAINTS,
  );
}
