import { mockMessages } from "@/data/mock/messages";
import { axiosClient, withMockFallback } from "@/services/api/axios-client";
import { endpoints } from "@/services/api/endpoints";
import type { ContactMessage, CreateContactMessageInput } from "@/types/message";

export const messagesService = {
  getMessages() {
    return withMockFallback(async () => {
      const { data } = await axiosClient.get<ContactMessage[]>(endpoints.messages);
      return data;
    }, mockMessages);
  },

  createMessage(payload: CreateContactMessageInput) {
    const created: ContactMessage = {
      id: `msg-${Date.now()}`,
      ...payload,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    return withMockFallback(async () => {
      const { data } = await axiosClient.post<ContactMessage>(endpoints.messages, payload);
      return data;
    }, created);
  },
};
