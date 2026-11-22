export type StaticAdminUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive";
};

export const STATIC_ADMIN_USERS: StaticAdminUser[] = [
  {
    id: "admin-001",
    name: "Admin User",
    email: "admin@hakimifastners.com",
    password: "Admin@123",
    role: "admin",
    status: "active",
  },
];

export function findStaticAdminByEmail(email: string): StaticAdminUser | undefined {
  const normalized = email.trim().toLowerCase();
  return STATIC_ADMIN_USERS.find(
    (user) => user.status === "active" && user.email.toLowerCase() === normalized,
  );
}

export function verifyStaticAdminCredentials(email: string, password: string): StaticAdminUser | null {
  const user = findStaticAdminByEmail(email);
  if (!user || user.password !== password) {
    return null;
  }

  return user;
}
