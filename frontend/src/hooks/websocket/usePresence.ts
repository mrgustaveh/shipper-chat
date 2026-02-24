import { useSession } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BASE_URL } from "@/lib/api/config";
import type { WebSocketMessage } from "@/lib/websocket/entities";
import { usePresenceStore } from "@/features/home/store/presence";

export const usePresence = () => {
  const { session } = useSession();
  const { setPresence } = usePresenceStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!session) return;

    let socket: Socket;

    const initSocket = async () => {
      const token = await session.getToken();

      socket = io(BASE_URL, {
        query: { token },
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("Global presence connected");
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("Global presence disconnected");
        setIsConnected(false);
      });

      socket.on("presence", (data: WebSocketMessage) => {
        if (data.type === "presence") {
          setPresence(data.user_id, data.online);
        }
      });

      socket.on("error", (err: Error) => {
        console.error("Presence Socket error:", err);
      });
    };

    initSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [session, setPresence]);

  return { isConnected };
};
