import { BASE_URL, AI_ENDPOINTS } from "./config";
import type { authArgs } from "./auth";
import type { AiConversation, AiMessage } from "../../features/home/store/ai";

export const listAiConversations = async (
  args: authArgs,
): Promise<AiConversation[]> => {
  const URL = BASE_URL + AI_ENDPOINTS.conversations;

  const res = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch AI conversations");
  }

  const data: AiConversation[] = await res.json();
  return data;
};

export const createAiConversation = async (
  args: authArgs,
): Promise<AiConversation> => {
  const URL = BASE_URL + AI_ENDPOINTS.conversations;

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.token}`,
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    throw new Error("Failed to create AI conversation");
  }

  const data: AiConversation = await res.json();
  return data;
};

export const deleteAiConversation = async (
  args: { id: string } & authArgs,
): Promise<void> => {
  const URL = BASE_URL + AI_ENDPOINTS.conversations + `/${args.id}`;

  const res = await fetch(URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete AI conversation");
  }
};

export const streamAiChat = async (
  args: {
    messages: AiMessage[];
    conversationId: string;
  } & authArgs,
): Promise<Response> => {
  const URL = BASE_URL + AI_ENDPOINTS.chat;

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.token}`,
    },
    body: JSON.stringify({
      messages: args.messages,
      conversationId: args.conversationId,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to get AI response");
  }

  return res;
};
