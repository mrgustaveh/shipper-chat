import { IoChatbubbleOutline } from "react-icons/io5";
import { BsArchive, BsVolumeMute } from "react-icons/bs";
import { PiUserCircle } from "react-icons/pi";
import { TfiExport } from "react-icons/tfi";
import { GoTrash } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import { UiPopOver } from "@/components/ui/UiPopOver";
import { useChatStore } from "../../store/chat";
import { useChats } from "@/hooks/data/usechats";
import { ContactCardInfo } from "./ContactInfoCard";
import "./contextmenu.scss";

type props = {
  chatId: string;
  userId: string;
  closeContextMenu: () => void;
};

export const MessageContextMenu = ({
  userId,
  chatId,
  closeContextMenu,
}: props) => {
  const {
    archiveChatMutation,
    markChatReadMutation,
    deleteChatMutation,
    listChatsQuery,
  } = useChats({ chatId });

  const archiveChat = () => {
    archiveChatMutation.mutateAsync({ chatId, archived: true }).then(() => {
      closeContextMenu();
    });
  };

  const markChatUnread = () => {
    markChatReadMutation.mutateAsync({ chatId, read: false }).then(() => {
      listChatsQuery.refetch();
      closeContextMenu();
    });
  };

  const deleteChat = () => {
    deleteChatMutation.mutateAsync({ chatId }).then(() => {
      useChatStore.setState({ chatMessages: [], selectedChatId: "" });
      listChatsQuery.refetch();
      closeContextMenu();
    });
  };

  return (
    <div id="msg_context_menu">
      <button onClick={markChatUnread}>
        <IoChatbubbleOutline size={18} /> Mark as unread
      </button>

      <button onClick={archiveChat}>
        <BsArchive size={18} /> Archive
      </button>

      <button onClick={closeContextMenu}>
        <BsVolumeMute size={18} /> Mute
      </button>

      <UiPopOver
        target={
          <button>
            <PiUserCircle size={18} /> Contact info
          </button>
        }
        options={{
          width: 200,
          position: "right-start",
          offset: 16,
          shadow: "sm",
        }}
      >
        <ContactCardInfo userId={userId} />
      </UiPopOver>

      <button onClick={closeContextMenu}>
        <TfiExport size={18} />
        Export chat
      </button>

      <button onClick={closeContextMenu}>
        <RxCross2 size={18} />
        Clear chat
      </button>

      <button className="delete" onClick={deleteChat}>
        <GoTrash size={18} /> Delete chat
      </button>
    </div>
  );
};
