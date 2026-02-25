import { useEffect, useRef } from "react";
import { HoverCard } from "@mantine/core";
import { TbMessage } from "react-icons/tb";
import { FaFile } from "react-icons/fa6";
import { useChatStore } from "../../store/chat";
import { useApiAuth } from "@/hooks/data/useapiauth";
import { useChats } from "@/hooks/data/usechats";
import type { Message } from "@/lib/api/entities";
import { dateDistanceToNow, shortenString } from "@/lib/utils";
import { VoiceMessagePlayer } from "./VoiceMessagePlayer";
import "./conversationmessages.scss";

export const ConversationMesssages = () => {
  const selectedChatId = useChatStore((s) => s.selectedChatId);
  const chatMessages = useChatStore((s) => s.chatMessages);
  const { getAccountQuery } = useApiAuth();
  const { listChatMessagesQuery } = useChats({ chatId: selectedChatId });

  const ctrRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    useChatStore.setState({ chatMessages: [] });
  }, [selectedChatId]);

  useEffect(() => {
    if (listChatMessagesQuery?.data !== undefined) {
      useChatStore.setState({ chatMessages: listChatMessagesQuery?.data });
    }
  }, [listChatMessagesQuery?.data]);

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
            Pick up a conversation where you left <br />
            or start a new one
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
  media = [],
  docs = [],
  voiceUrl,
  currentUserId,
}: messageprops) => {
  return (
    <div
      className={`chat_message_ctr ${sender?.accountId == currentUserId ? "chat_message_sent" : "chat_message_received"}`}
    >
      <div className="chat_message">
        <div className="_message_timer">
          {voiceUrl && <VoiceMessagePlayer src={voiceUrl} />}

          {media.length > 0 && (
            <div className="_message_media">
              {media.map((url, i) => (
                <img key={i} src={url} alt="Shared media" />
              ))}
            </div>
          )}

          {docs.length > 0 && (
            <div className="_message_docs">
              {docs.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer">
                  <FaFile /> View Document
                </a>
              ))}
            </div>
          )}
          {textContent && (
            <span className="_message">
              {textContent.split(/(https?:\/\/[^\s]+)/g).map((part, i) => {
                if (part.match(/^https?:\/\/[^\s]+$/)) {
                  return (
                    <HoverCard
                      radius="lg"
                      shadow="md"
                      withArrow
                      styles={{ dropdown: { padding: "0.25rem" } }}
                      key={i}
                    >
                      <HoverCard.Target>
                        <a key={i} href={part} target="_blank" rel="noreferrer">
                          {shortenString(part, { leading: 10 })}
                        </a>
                      </HoverCard.Target>
                      <HoverCard.Dropdown>
                        <span style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                          {part}
                        </span>
                      </HoverCard.Dropdown>
                    </HoverCard>
                  );
                }
                return part;
              })}
            </span>
          )}
          <span className="_timer">{dateDistanceToNow(created)}</span>
        </div>
      </div>
    </div>
  );
};
