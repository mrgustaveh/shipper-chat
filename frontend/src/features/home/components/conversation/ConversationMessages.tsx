import { useEffect, useRef } from "react";
import { TbMessage } from "react-icons/tb";
import { useChatStore } from "../../store/chat";
import { useApiAuth } from "@/hooks/data/useapiauth";
import type { Message } from "@/lib/api/entities";
import { dateDistanceToNow } from "@/lib/utils";
import "./conversationmessages.scss";

export const ConversationMesssages = () => {
  const { selectedChatId, chatMessages } = useChatStore();
  const { getAccountQuery } = useApiAuth();
  const ctrRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    ctrRef.current.scrollTop = ctrRef.current.scrollHeight;
  }, [chatMessages.length]);

  return (
    <div id="conversation_messages" ref={ctrRef}>
      {selectedChatId !== "" &&
        chatMessages?.map((_message, idx) => (
          <ChatMessage
            key={_message?.messageId + idx}
            currentUserId={getAccountQuery?.data?.accountId ?? ""}
            {..._message}
          />
        ))}

      {selectedChatId == "" && (
        <div className="no_messages no_channel_selected">
          <span>
            Pick up the conversation or create <br /> a new one...
          </span>
        </div>
      )}

      {selectedChatId !== "" && chatMessages?.length == 0 && (
        <div className="no_messages">
          <span>
            Send a message to <br /> start the conversation
          </span>
          <TbMessage size={36} />
        </div>
      )}
    </div>
  );
};

type messageprops = {
  currentUserId: string;
} & Message;

const ChatMessage = ({
  created,
  sender,
  textContent,
  currentUserId,
}: messageprops) => {
  return (
    <div
      className={`chat_message_ctr ${sender?.accountId == currentUserId ? "chat_message_sent" : "chat_message_received"}`}
    >
      <div className="chat_message">
        <img
          src={sender?.displayPic ?? "/icon-bg.png"}
          alt="profile"
          loading="lazy"
          className="_profile"
        />

        <div className="_message_timer">
          <span className="_message">{textContent}</span>
          <span className="_timer">{dateDistanceToNow(created)}</span>
        </div>
      </div>
    </div>
  );
};
