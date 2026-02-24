export type Account = {
  accountId: string;
  clerkId: string | null;
  email: string | null;
  username: string | null;
  displayPic: string | null;
  created: string;
};

export type Message = {
  messageId: string;
  senderId: string;
  textContent: string;
  media: string[];
  links: string[];
  docs: string[];
  userChatId: string | null;
  created: string;
  sender?: Account;
};

export type Chat = {
  chatId: string;
  user1Id: string;
  user2Id: string;
  user1Archived: boolean;
  user2Archived: boolean;
  user1LastReadAt: string | null;
  user2LastReadAt: string | null;
  created: string;
  updated: string;
  user1: Account;
  user2: Account;
  messages: Message[];
  unreadCount: number;
};

export interface UploadResponse {
  url: string;
  original_name: string;
  format: string;
  size: number;
}
