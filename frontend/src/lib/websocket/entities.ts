export type ChatMessage = {
  type: "chat_message";
  message_id: string;
  sender: {
    account_id: string;
    username: string | null;
    email: string | null;
    display_pic: string | null;
    created: string;
  };
  text_content: string;
  media: string[];
  links: string[];
  docs: string[];
  created: string;
};

export type TypingEvent = {
  type: "typing";
  user_id: string;
  username: string | null;
  is_typing: boolean;
};

export type PresenceEvent = {
  type: "presence";
  user_id: string;
  username: string | null;
  online: boolean;
};

export type WebSocketMessage =
  | ChatMessage
  | TypingEvent
  | PresenceEvent
  | { type: "error"; message: string };
