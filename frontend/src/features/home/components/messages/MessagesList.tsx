import { useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useApiAuth } from "@/hooks/data/useapiauth";
import { useChats } from "@/hooks/data/usechats";
import { useChatStore } from "../../store/chat";
import { useSearchStore } from "../../store/search";
import { UiPopOver } from "@/components/ui/UiPopOver";
import { MessageContextMenu } from "./MessageContextMenu";
import type { Account, Chat } from "@/lib/api/entities";
import { dateDistanceToNow, shortenString } from "@/lib/utils";
import "./messageslist.scss";

export const MessagesList = () => {
  const { getAccountQuery } = useApiAuth();
  const { listChatsQuery } = useChats({});
  const searchvalue = useSearchStore((s) => s.searchVaue);

  const chats = useMemo(() => {
    return searchvalue == ""
      ? listChatsQuery?.data
      : listChatsQuery?.data?.filter(
          (_chat) =>
            _chat?.user1?.username
              ?.toLowerCase()
              ?.includes(searchvalue?.trim()?.toLowerCase()) ||
            _chat?.user2?.username
              ?.toLowerCase()
              ?.includes(searchvalue?.trim()?.toLowerCase()) ||
            _chat?.user1?.email
              ?.toLowerCase()
              ?.includes(searchvalue?.trim()?.toLowerCase()) ||
            _chat?.user2?.email
              ?.toLowerCase()
              ?.includes(searchvalue?.trim()?.toLowerCase()),
        );
  }, [searchvalue, listChatsQuery?.data]);

  return (
    <div id="messages_list">
      {chats?.map((_chat, idx) => (
        <MessagePreview
          key={_chat?.chatId + idx}
          authUserId={getAccountQuery?.data?.accountId ?? ""}
          {..._chat}
        />
      ))}
    </div>
  );
};

type messageProps = { authUserId: string } & Chat;

const MessagePreview = ({
  authUserId,
  chatId,
  user1,
  user2,
  created,
  messages,
  unreadCount,
}: messageProps) => {
  const [opened, { open, close }] = useDisclosure();
  const selectedchatid = useChatStore((s) => s.selectedChatId);
  const renderuser: Account = authUserId == user1?.accountId ? user2 : user1;
  const { markChatReadMutation, listChatsQuery } = useChats({});

  const openConversation = () => {
    useChatStore.setState({ selectedChatId: chatId });

    markChatReadMutation.mutate(
      { chatId, read: true },
      {
        onSuccess: () => listChatsQuery.refetch(),
      },
    );
  };

  return (
    <UiPopOver
      target={
        <button
          className={`message_preview ${selectedchatid == chatId ? "selected_chat" : ""}`}
          onClick={openConversation}
          onContextMenu={(e) => {
            e.preventDefault();
            open();
          }}
        >
          <img
            src={renderuser?.displayPic ?? "/icon-bg.png"}
            alt="profile picture"
            loading="lazy"
          />

          <div className="_msg_details">
            <p>
              {renderuser?.username}
              <span>
                {dateDistanceToNow(messages?.at(-1)?.created ?? created ?? "")}
              </span>
            </p>

            <p>
              <span>
                {messages?.at(-1)?.textContent
                  ? shortenString(messages?.at(-1)?.textContent ?? "")
                  : "Start the conversation"}
              </span>

              {unreadCount > 0 && (
                <span className="unread_counter">{unreadCount}</span>
              )}
            </p>
          </div>
        </button>
      }
      options={{
        width: 200,
        opened: opened,
        onChange: close,
        offset: -56,
        shadow: "md",
      }}
    >
      <MessageContextMenu
        userId={renderuser?.accountId}
        chatId={chatId}
        closeContextMenu={close}
      />
    </UiPopOver>
  );
};
