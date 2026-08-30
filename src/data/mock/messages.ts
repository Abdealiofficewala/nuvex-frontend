import type { ContactMessage } from "@/types/message";

export const mockMessages: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Riya Kapoor",
    email: "riya.kapoor@example.com",
    company: "Westline Fabricators",
    productId: "prd-hex-bolt",
    productSlug: "nx-hex-bolt",
    message: "Need 2,000 pcs M12 × 50 mm grade 8.8 hex bolts with nuts, zinc plated. Please quote rate and lead time.",
    status: "new",
    createdAt: "2026-08-18T09:12:00.000Z",
  },
  {
    id: "msg-2",
    name: "Dev Patel",
    email: "dev.patel@example.com",
    phone: "+91 98000 00000",
    message: "Looking for 50 kg of 75 mm GI wire nails and a carton of No.8 self-tapping screws.",
    status: "read",
    createdAt: "2026-08-12T14:40:00.000Z",
  },
];
