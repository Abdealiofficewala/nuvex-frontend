export const ADMIN_USER_ROLES = ["admin", "editor", "viewer"] as const;

export type AdminUserRole = (typeof ADMIN_USER_ROLES)[number];

export type AdminUserAddressField =
  | "addressLine1"
  | "addressLine2"
  | "village"
  | "city"
  | "pincode"
  | "state";

export const ADMIN_USER_ADDRESS_FIELDS: AdminUserAddressField[] = [
  "addressLine1",
  "addressLine2",
  "village",
  "city",
  "pincode",
  "state",
];

export type AdminUserRecord = {
  id: string;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  image: string;
  designation: string;
  addressLine1: string;
  addressLine2: string;
  village: string;
  city: string;
  pincode: string;
  state: string;
  role: AdminUserRole;
  roleId?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
};

export type AdminUserInput = Omit<AdminUserRecord, "id" | "createdAt">;

export function getAdminUserFullName(user: Pick<AdminUserRecord, "firstName" | "lastName">) {
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
}

export function formatAdminUserAddress(user: Pick<AdminUserRecord, AdminUserAddressField>) {
  return [
    user.addressLine1,
    user.addressLine2,
    user.village,
    user.city,
    user.pincode,
    user.state,
  ]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");
}

export function emptyAdminUserAddress(): Pick<
  AdminUserRecord,
  AdminUserAddressField
> {
  return {
    addressLine1: "",
    addressLine2: "",
    village: "",
    city: "",
    pincode: "",
    state: "",
  };
}
