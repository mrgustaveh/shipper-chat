export const BASE_URL = "http://localhost:8001";

export const AUTH_ENDPOINTS = {
  me: "/api/user/me",
  users: "/api/user/list",
  profile: "/api/user",
};

export const CHAT_ENDPOINTS = {
  chats: "/api/chat/user-chats",
  messages: "/api/chat/messages",
  media: "/api/media/upload",
};
