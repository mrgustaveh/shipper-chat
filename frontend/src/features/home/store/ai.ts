import { create } from "zustand";

export type AiMessage = {
  id?: string;
  role: "user" | "assistant";
  content: string;
  created?: string;
};

export type AiConversation = {
  id: string;
  title: string;
  messages: AiMessage[];
  created: string;
  updated: string;
};

type AiChatStore = {
  conversations: AiConversation[];
  activeConversationId: string | null;
  messages: AiMessage[];
  isStreaming: boolean;
  error: string | null;
};

type AiChatActions = {
  setConversations: (conversations: AiConversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  addConversation: (conversation: AiConversation) => void;
  removeConversation: (id: string) => void;
  addMessage: (message: AiMessage) => void;
  updateLastAssistantMessage: (content: string) => void;
  setStreaming: (streaming: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
};

export const useAiChatStore = create<AiChatStore & AiChatActions>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isStreaming: false,
  error: null,

  setConversations(conversations) {
    set(() => ({ conversations }));
  },

  setActiveConversation(id) {
    set((state) => {
      const convo = state.conversations.find((c) => c.id === id);
      return {
        activeConversationId: id,
        messages: convo?.messages ?? [],
        error: null,
      };
    });
  },

  addConversation(conversation) {
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    }));
  },

  removeConversation(id) {
    set((state) => {
      const conversations = state.conversations.filter((c) => c.id !== id);
      const isActive = state.activeConversationId === id;
      return {
        conversations,
        activeConversationId: isActive
          ? (conversations[0]?.id ?? null)
          : state.activeConversationId,
        messages: isActive
          ? (conversations[0]?.messages ?? [])
          : state.messages,
      };
    });
  },

  addMessage(message) {
    set((state) => ({ messages: [...state.messages, message], error: null }));
  },

  updateLastAssistantMessage(content) {
    set((state) => {
      const messages = [...state.messages];
      const lastIdx = messages.length - 1;
      if (lastIdx >= 0 && messages[lastIdx].role === "assistant") {
        messages[lastIdx] = { ...messages[lastIdx], content };
      }
      return { messages };
    });
  },

  setStreaming(streaming) {
    set(() => ({ isStreaming: streaming }));
  },

  setError(error) {
    set(() => ({ error }));
  },

  clearMessages() {
    set(() => ({ messages: [], error: null }));
  },
}));
