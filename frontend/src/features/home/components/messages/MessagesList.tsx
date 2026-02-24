import { RiCheckDoubleFill } from "react-icons/ri";
import { useApiAuth } from "@/hooks/data/useapiauth";
import { useChats } from "@/hooks/data/usechats";
import { useChatStore } from "../../store/chat";
import { COLORS } from "@/lib/constants";
import type { Account, Chat } from "@/lib/api/entities";
import { dateDistanceToNow, shortenString } from "@/lib/utils";
import "./messageslist.scss";

export const MessagesList = () => {
  const { getAccountQuery } = useApiAuth();
  const { listChatsQuery } = useChats({});

  return (
    <div id="messages_list">
      {listChatsQuery?.data?.map((_chat, idx) => (
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
}: messageProps) => {
  const selectedchatid = useChatStore((s) => s.selectedChatId);
  const renderuser: Account = authUserId == user1?.accountId ? user2 : user1;

  return (
    <button
      id="message_preview"
      className={selectedchatid == chatId ? "selected_chat" : ""}
      onClick={() => useChatStore.setState({ selectedChatId: chatId })}
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
          <RiCheckDoubleFill size={16} color={COLORS.success} />
        </p>
      </div>
    </button>
  );
};
