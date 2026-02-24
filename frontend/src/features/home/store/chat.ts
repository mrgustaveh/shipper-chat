import { create } from "zustand";
import type { Message } from "@/lib/api/entities";

type chatstore = {
  selectedChatId: string;
  chatMessages: Message[];
  typingUsers: Record<string, boolean>;
};

type actions = {
  setSelectedChat: (chatId: chatstore["selectedChatId"]) => void;
  setInitialMessages: (messages: Message[]) => void;
  updateMessages: (message: Message) => void;
  setTyping: (userId: string, isTyping: boolean) => void;
  resetRoomStatus: () => void;
};

export const useChatStore = create<chatstore & actions>((set) => ({
  selectedChatId: "",
  chatMessages: [],
  typingUsers: {},
  setSelectedChat(chatId) {
    set(() => ({ selectedChatId: chatId }));
  },
  setInitialMessages(messages) {
    set(() => ({ chatMessages: messages }));
  },
  updateMessages(message) {
    set((state) => ({ chatMessages: [...state.chatMessages, message] }));
  },
  setTyping(userId, isTyping) {
    set((state) => ({
      typingUsers: { ...state.typingUsers, [userId]: isTyping },
    }));
  },
  resetRoomStatus() {
    set(() => ({ typingUsers: {} }));
  },
}));
