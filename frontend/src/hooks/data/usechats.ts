import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "@clerk/clerk-react";
import {
  listChats,
  createChat,
  listChatMessages,
  uploadMedia,
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

  return {
    listChatsQuery,
    listChatMessagesQuery,
    createChatMutation,
    uploadMediaMutation,
  };
};
