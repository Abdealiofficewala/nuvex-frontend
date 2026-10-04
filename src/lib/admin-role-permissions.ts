import {
  ADMIN_ACCESS_MENU_MODULES,
  type AdminAccessMenuModuleId,
} from "@/lib/admin-menu";
import {
  getDefaultPageAccess,
  getMenuModulePermission,
  setMenuModulePermission,
  type AdminUserPageAccess,
} from "@/lib/admin-page-access.config";

export const ROLE_MATRIX_PERMISSIONS = ["view", "create", "edit", "delete"] as const;

export type RoleMatrixPermission = (typeof ROLE_MATRIX_PERMISSIONS)[number];

export type RolePermissionSummary = {
  moduleTotal: number;
  modulesWithView: number;
  modulesFull: number;
  view: number;
  create: number;
  edit: number;
  delete: number;
};

export function isRoleModulePermissionEnabled(
  access: AdminUserPageAccess,
  moduleId: AdminAccessMenuModuleId,
  permission: RoleMatrixPermission,
): boolean {
  if (permission === "view") {
    return (
      getMenuModulePermission(access, moduleId, "view") ||
      getMenuModulePermission(access, moduleId, "read")
    );
  }

  return getMenuModulePermission(access, moduleId, permission);
}

export function applyRoleModulePermission(
  access: AdminUserPageAccess,
  moduleId: AdminAccessMenuModuleId,
  permission: RoleMatrixPermission,
  enabled: boolean,
): AdminUserPageAccess {
  let next = setMenuModulePermission(access, moduleId, permission, enabled);

  if (permission === "view") {
    next = setMenuModulePermission(next, moduleId, "read", enabled);
    if (!enabled) {
      for (const dependent of ["create", "edit", "delete", "write"] as const) {
        next = setMenuModulePermission(next, moduleId, dependent, false);
      }
    }
  }

  if ((permission === "create" || permission === "edit" || permission === "delete") && enabled) {
    next = setMenuModulePermission(next, moduleId, "view", true);
    next = setMenuModulePermission(next, moduleId, "read", true);
    next = setMenuModulePermission(next, moduleId, "write", true);
  }

  if (
    (permission === "create" || permission === "edit" || permission === "delete") &&
    !enabled
  ) {
    const hasWrite =
      isRoleModulePermissionEnabled(next, moduleId, "create") ||
      isRoleModulePermissionEnabled(next, moduleId, "edit") ||
      isRoleModulePermissionEnabled(next, moduleId, "delete");
    next = setMenuModulePermission(next, moduleId, "write", hasWrite);
  }

  return next;
}

export function enableAllForRoleModule(
  access: AdminUserPageAccess,
  moduleId: AdminAccessMenuModuleId,
): AdminUserPageAccess {
  let next = access;
  for (const permission of ROLE_MATRIX_PERMISSIONS) {
    next = applyRoleModulePermission(next, moduleId, permission, true);
  }
  return next;
}

export function clearRoleModule(
  access: AdminUserPageAccess,
  moduleId: AdminAccessMenuModuleId,
): AdminUserPageAccess {
  let next = access;
  for (const permission of ROLE_MATRIX_PERMISSIONS) {
    next = applyRoleModulePermission(next, moduleId, permission, false);
  }
  return next;
}

export function setAllModulesForPermission(
  access: AdminUserPageAccess,
  permission: RoleMatrixPermission,
  enabled: boolean,
): AdminUserPageAccess {
  return ADMIN_ACCESS_MENU_MODULES.reduce(
    (current, module) => applyRoleModulePermission(current, module.id, permission, enabled),
    access,
  );
}

export function isAllModulesPermissionEnabled(
  access: AdminUserPageAccess,
  permission: RoleMatrixPermission,
): boolean {
  return ADMIN_ACCESS_MENU_MODULES.every((module) =>
    isRoleModulePermissionEnabled(access, module.id, permission),
  );
}

export function toggleAllModulesForPermission(
  access: AdminUserPageAccess,
  permission: RoleMatrixPermission,
): AdminUserPageAccess {
  const enable = !isAllModulesPermissionEnabled(access, permission);
  return setAllModulesForPermission(access, permission, enable);
}

export function summarizeRolePermissions(access: AdminUserPageAccess): RolePermissionSummary {
  const summary: RolePermissionSummary = {
    moduleTotal: ADMIN_ACCESS_MENU_MODULES.length,
    modulesWithView: 0,
    modulesFull: 0,
    view: 0,
    create: 0,
    edit: 0,
    delete: 0,
  };

  for (const module of ADMIN_ACCESS_MENU_MODULES) {
    const flags = ROLE_MATRIX_PERMISSIONS.map((permission) =>
      isRoleModulePermissionEnabled(access, module.id, permission),
    );

    if (flags[0]) {
      summary.modulesWithView += 1;
    }

    if (flags.every(Boolean)) {
      summary.modulesFull += 1;
    }

    ROLE_MATRIX_PERMISSIONS.forEach((permission, index) => {
      if (flags[index]) {
        summary[permission] += 1;
      }
    });
  }

  return summary;
}

export function getRoleModuleCoverageScore(
  access: AdminUserPageAccess,
  moduleId: AdminAccessMenuModuleId,
): number {
  return ROLE_MATRIX_PERMISSIONS.filter((permission) =>
    isRoleModulePermissionEnabled(access, moduleId, permission),
  ).length;
}

export function clearAllRolePermissions(): AdminUserPageAccess {
  return getDefaultPageAccess("none");
}

export const ROLE_MODULE_EMOJI: Record<AdminAccessMenuModuleId, string> = {
  dashboard: "📊",
  userManagement: "👥",
  theme: "🎨",
  hero: "🖼️",
  industries: "🏭",
  products: "📦",
  companyDetails: "🏢",
  teamMembers: "🤝",
};
