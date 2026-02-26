export const BASE_URL = import.meta.env.DEV
  ? "http://localhost:8001"
  : "https://shipper-chat-backend.onrender.com";

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
