import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "@clerk/clerk-react";
import {
  listChats,
  createChat,
  listChatMessages,
  uploadMedia,
  archiveChat,
  markChatRead,
  deleteChat,
} from "@/lib/api/chat";

type args = {
  chatId?: string;
};

export const useChats = (args: args) => {
  const { session } = useSession();

  const listChatsQuery = useQuery({
    queryKey: ["list-chats"],
    queryFn: async () => {
      const token = await session?.getToken();
      return listChats({ token: token ?? "" });
    },
    enabled: !!session,
  });

  const listChatMessagesQuery = useQuery({
    queryKey: ["list-chat-messages", args?.chatId],
    queryFn: async () => {
      const token = await session?.getToken();
      return listChatMessages({
        chatId: args?.chatId ?? "",
        token: token ?? "",
      });
    },
    enabled: !!session && !!args?.chatId,
  });

  const createChatMutation = useMutation({
    mutationFn: async (
      mutationArgs: Omit<Parameters<typeof createChat>[0], "token">,
    ) => {
      const token = await session?.getToken();
      return createChat({ ...mutationArgs, token: token ?? "" });
    },
  });

  const uploadMediaMutation = useMutation({
    mutationFn: async (args: { file: File }) => {
      const token = await session?.getToken();
      return uploadMedia({ ...args, token: token ?? "" });
    },
  });

  const archiveChatMutation = useMutation({
    mutationFn: async (args: { chatId: string; archived: boolean }) => {
      const token = await session?.getToken();
      return archiveChat({ ...args, token: token ?? "" });
    },
  });

  const markChatReadMutation = useMutation({
    mutationFn: async (args: { chatId: string; read: boolean }) => {
      const token = await session?.getToken();
      return markChatRead({ ...args, token: token ?? "" });
    },
  });

  const deleteChatMutation = useMutation({
    mutationFn: async (args: { chatId: string }) => {
      const token = await session?.getToken();
      return deleteChat({ ...args, token: token ?? "" });
    },
  });

  return {
    listChatsQuery,
    listChatMessagesQuery,
    createChatMutation,
    uploadMediaMutation,
    archiveChatMutation,
    markChatReadMutation,
    deleteChatMutation,
  };
};
