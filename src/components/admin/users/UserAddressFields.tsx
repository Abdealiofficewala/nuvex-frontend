"use client";

import { useId } from "react";
import { AdminFormField } from "@/components/admin/common";
import type { AdminUserAddressField } from "@/lib/admin-users.config";
import type { AdminUserProfileValues } from "@/lib/validations/admin-user";

type UserAddressFieldsProps = {
  values: Pick<AdminUserProfileValues, AdminUserAddressField>;
  disabled?: boolean;
  saving?: boolean;
  showTitle?: boolean;
  translate: (key: string) => string;
  getVisibleFieldError: (field: AdminUserAddressField) => string | undefined;
  getFieldErrorMessage: (errorKey: string) => string;
  onFieldChange: <K extends AdminUserAddressField>(field: K, value: AdminUserProfileValues[K]) => void;
  onFieldBlur: (field: AdminUserAddressField) => void;
};

export function UserAddressFields({
  values,
  disabled = false,
  saving = false,
  showTitle = true,
  translate,
  getVisibleFieldError,
  getFieldErrorMessage,
  onFieldChange,
  onFieldBlur,
}: UserAddressFieldsProps) {
  const addressLine1Id = useId();
  const addressLine2Id = useId();
  const villageId = useId();
  const cityId = useId();
  const pincodeId = useId();
  const stateId = useId();
  const isDisabled = disabled || saving;

  return (
    <>
      {showTitle ? (
        <p className="admin-form-grid__full admin-user-form__section-title">{translate("address.title")}</p>
      ) : null}

      <AdminFormField
        id={addressLine1Id}
        label={translate("fields.addressLine1")}
        required
        className="admin-form-grid__full"
        value={values.addressLine1}
        placeholder={translate("placeholders.addressLine1")}
        disabled={isDisabled}
        fieldError={getVisibleFieldError("addressLine1")}
        getErrorMessage={getFieldErrorMessage}
        onChange={(event) => onFieldChange("addressLine1", event.target.value)}
        onBlur={() => onFieldBlur("addressLine1")}
        autoComplete="address-line1"
      />

      <AdminFormField
        id={addressLine2Id}
        label={translate("fields.addressLine2")}
        className="admin-form-grid__full"
        value={values.addressLine2}
        placeholder={translate("placeholders.addressLine2")}
        disabled={isDisabled}
        fieldError={getVisibleFieldError("addressLine2")}
        getErrorMessage={getFieldErrorMessage}
        onChange={(event) => onFieldChange("addressLine2", event.target.value)}
        onBlur={() => onFieldBlur("addressLine2")}
        autoComplete="address-line2"
      />

      <AdminFormField
        id={villageId}
        label={translate("fields.village")}
        required
        value={values.village}
        placeholder={translate("placeholders.village")}
        disabled={isDisabled}
        fieldError={getVisibleFieldError("village")}
        getErrorMessage={getFieldErrorMessage}
        onChange={(event) => onFieldChange("village", event.target.value)}
        onBlur={() => onFieldBlur("village")}
        autoComplete="address-level3"
      />

      <AdminFormField
        id={cityId}
        label={translate("fields.city")}
        required
        value={values.city}
        placeholder={translate("placeholders.city")}
        disabled={isDisabled}
        fieldError={getVisibleFieldError("city")}
        getErrorMessage={getFieldErrorMessage}
        onChange={(event) => onFieldChange("city", event.target.value)}
        onBlur={() => onFieldBlur("city")}
        autoComplete="address-level2"
      />

      <AdminFormField
        id={pincodeId}
        label={translate("fields.pincode")}
        required
        value={values.pincode}
        placeholder={translate("placeholders.pincode")}
        disabled={isDisabled}
        inputMode="numeric"
        fieldError={getVisibleFieldError("pincode")}
        getErrorMessage={getFieldErrorMessage}
        onChange={(event) => onFieldChange("pincode", event.target.value)}
        onBlur={() => onFieldBlur("pincode")}
        autoComplete="postal-code"
      />

      <AdminFormField
        id={stateId}
        label={translate("fields.state")}
        required
        value={values.state}
        placeholder={translate("placeholders.state")}
        disabled={isDisabled}
        fieldError={getVisibleFieldError("state")}
        getErrorMessage={getFieldErrorMessage}
        onChange={(event) => onFieldChange("state", event.target.value)}
        onBlur={() => onFieldBlur("state")}
        autoComplete="address-level1"
      />
    </>
  );
}
