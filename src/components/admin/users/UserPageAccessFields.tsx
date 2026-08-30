"use client";

import { useId } from "react";
import { AdminCheckbox } from "@/components/admin/common/AdminCheckbox";
import { ADMIN_ACCESS_MENU_MODULES, type AdminAccessMenuModuleId } from "@/lib/admin-menu";
import {
  ADMIN_PAGE_PERMISSIONS,
  getMenuModulePermission,
  setMenuModulePermission,
  type AdminPagePermission,
  type AdminUserPageAccess,
} from "@/lib/admin-page-access.config";

type UserPageAccessFieldsProps = {
  value: AdminUserPageAccess;
  disabled?: boolean;
  readOnly?: boolean;
  translate: (key: string) => string;
  onChange?: (access: AdminUserPageAccess) => void;
};

export function UserPageAccessFields({
  value,
  disabled = false,
  readOnly = false,
  translate,
  onChange,
}: UserPageAccessFieldsProps) {
  const baseId = useId();

  function updatePermission(
    moduleId: AdminAccessMenuModuleId,
    permission: AdminPagePermission,
    enabled: boolean,
  ) {
    onChange?.(setMenuModulePermission(value, moduleId, permission, enabled));
  }

  return (
    <div className="admin-access-matrix-wrap">
      <table className="admin-access-matrix">
        <thead>
          <tr>
            <th scope="col">{translate("columns.module")}</th>
            {ADMIN_PAGE_PERMISSIONS.map((permission) => (
              <th key={permission} scope="col" className="is-center">
                {translate(`permissions.${permission}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ADMIN_ACCESS_MENU_MODULES.map((module) => (
            <tr key={module.id}>
              <th scope="row">
                <span className="admin-access-matrix__module">{translate(`menus.${module.id}`)}</span>
                <small className="admin-access-matrix__hint">{translate(`menusHint.${module.id}`)}</small>
              </th>
              {ADMIN_PAGE_PERMISSIONS.map((permission) => {
                const inputId = `${baseId}-${module.id}-${permission}`;
                const checked = getMenuModulePermission(value, module.id, permission);

                return (
                  <td key={permission} className="is-center">
                    <AdminCheckbox
                      id={inputId}
                      checked={checked}
                      disabled={disabled}
                      readOnly={readOnly}
                      label={`${translate(`menus.${module.id}`)} · ${translate(`permissions.${permission}`)}`}
                      onChange={
                        readOnly
                          ? undefined
                          : (nextChecked) => updatePermission(module.id, permission, nextChecked)
                      }
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
