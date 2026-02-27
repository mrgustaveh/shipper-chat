import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "@clerk/clerk-react";
import {
  listAiConversations,
  createAiConversation,
  deleteAiConversation,
  streamAiChat,
} from "@/lib/api/ai";

export const useAiChat = () => {
  const { session } = useSession();

  const listConversationsQuery = useQuery({
    queryKey: ["list-ai-conversations"],
    queryFn: async () => {
      const token = await session?.getToken();
      return listAiConversations({ token: token ?? "" });
    },
    enabled: !!session,
  });

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const token = await session?.getToken();
      return createAiConversation({ token: token ?? "" });
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (args: { id: string }) => {
      const token = await session?.getToken();
      return deleteAiConversation({ ...args, token: token ?? "" });
    },
  });

  // streamAiChat returns a Response, which is handled specially in the component for streaming
  const streamChatMutation = useMutation({
    mutationFn: async (
      args: Omit<Parameters<typeof streamAiChat>[0], "token">,
    ) => {
      const token = await session?.getToken();
      return streamAiChat({ ...args, token: token ?? "" });
    },
  });

  return {
    listConversationsQuery,
    createConversationMutation,
    deleteConversationMutation,
    streamChatMutation,
  };
};
