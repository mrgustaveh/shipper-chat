import { BASE_URL, CHAT_ENDPOINTS } from "./config";
import type { Chat, Message } from "./entities";
import type { authArgs } from "./auth";

export const listChats = async (
  args: {
    includeArchived?: boolean;
  } & authArgs,
): Promise<Chat[]> => {
  const query = args.includeArchived ? "?include_archived=true" : "";
  const URL = BASE_URL + CHAT_ENDPOINTS.chats + query;

  const res = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.token}`,
    },
  });

  const data: Chat[] = await res.json();
  return data;
};

export const createChat = async (
  args: {
    user2Id: string;
  } & authArgs,
): Promise<Chat> => {
  const URL = BASE_URL + CHAT_ENDPOINTS.chats;

  const res = await fetch(URL, {
    method: "POST",
    body: JSON.stringify({ user2Id: args.user2Id }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.token}`,
    },
  });

  const data: Chat = await res.json();
  return data;
};

export const archiveChat = async (
  args: {
    chatId: string;
    archived: boolean;
  } & authArgs,
): Promise<Chat> => {
  const URL = BASE_URL + CHAT_ENDPOINTS.chats + `/${args.chatId}/archive`;

  const res = await fetch(URL, {
    method: "PATCH",
    body: JSON.stringify({ archived: args.archived }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.token}`,
    },
  });

  const data: Chat = await res.json();
  return data;
};

export const markChatRead = async (
  args: {
    chatId: string;
    read: boolean;
  } & authArgs,
): Promise<Chat> => {
  const URL = BASE_URL + CHAT_ENDPOINTS.chats + `/${args.chatId}/read`;

  const res = await fetch(URL, {
    method: "PATCH",
    body: JSON.stringify({ read: args.read }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.token}`,
    },
  });

  const data: Chat = await res.json();
  return data;
};

export const listChatMessages = async (
  args: {
    chatId: string;
  } & authArgs,
): Promise<Message[]> => {
  const URL = BASE_URL + CHAT_ENDPOINTS.messages + `?user_chat=${args.chatId}`;

  const res = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.token}`,
    },
  });

  const data: Message[] = await res.json();
  return data;
};

export const uploadMedia = async (
  args: {
    file: File;
  } & authArgs,
): Promise<{
  url: string;
  original_name: string;
  format: string;
  size: number;
}> => {
  const URL = BASE_URL + CHAT_ENDPOINTS.media;
  const formData = new FormData();
  formData.append("file", args.file);

  const res = await fetch(URL, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${args.token}`,
    },
  });

  const data = await res.json();
  return data;
};
