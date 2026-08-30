export type MessageStatus = "new" | "read" | "archived";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  productSlug?: string;
  productId?: string;
  size?: string;
  quantity?: string;
  industry?: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
};

export type CreateContactMessageInput = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  productSlug?: string;
  productId?: string;
  size?: string;
  quantity?: string;
  industry?: string;
  message: string;
};
