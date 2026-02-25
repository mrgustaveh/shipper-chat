import { useSession } from "@clerk/clerk-react";
import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BASE_URL } from "@/lib/api/config";
import type { Message } from "@/lib/api/entities";
import type { WebSocketMessage } from "@/lib/websocket/entities";
import { useChatStore } from "@/features/home/store/chat";

type args = {
  chatId?: string;
};

export const useRealTimeChat = ({ chatId }: args) => {
  const { session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const { updateMessages, setTyping, resetRoomStatus } = useChatStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!session || !chatId) return;

    resetRoomStatus();

    let socket: Socket;

    const initSocket = async () => {
      const token = await session.getToken();

      socket = io(BASE_URL, {
        query: { token, chatId },
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("Chat socket connected successfully");
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("Chat socket disconnected");
        setIsConnected(false);
      });

      socket.on("chat_message", (data: WebSocketMessage) => {
        if (data.type === "chat_message") {
          const mappedMessage: Message = {
            messageId: data.message_id,
            senderId: data.sender.account_id,
            textContent: data.text_content,
            media: data.media,
            links: data.links,
            docs: data.docs,
            voiceUrl: data.voice_url,
            created: data.created,
            userChatId: chatId,
            sender: {
              accountId: data.sender.account_id,
              clerkId: null,
              username: data.sender.username,
              email: data.sender.email,
              displayPic: data.sender.display_pic,
              created: data.sender.created,
            },
          };
          updateMessages(mappedMessage);
        }
      });

      socket.on("typing", (data: WebSocketMessage) => {
        if (data.type === "typing") {
          setTyping(data.user_id, data.is_typing);
        }
      });

      socket.on("error", (err) => {
        console.error("Chat Socket error:", err);
      });

      socketRef.current = socket;
    };

    initSocket();

    return () => {
      if (socket) socket.disconnect();
      socketRef.current = null;
      resetRoomStatus();
    };
  }, [session, chatId, updateMessages, setTyping, resetRoomStatus]);

  const sendMessage = useCallback(
    (
      text: string,
      media: string[] = [],
      links: string[] = [],
      docs: string[] = [],
      voiceUrl?: string,
    ) => {
      socketRef.current?.emit("chat_message", {
        text_content: text,
        media,
        links,
        docs,
        voiceUrl,
      });
    },
    [],
  );

  const sendTyping = useCallback((isTyping: boolean) => {
    socketRef.current?.emit("typing", {
      is_typing: isTyping,
    });
  }, []);

  return { sendMessage, sendTyping, isConnected };
};
