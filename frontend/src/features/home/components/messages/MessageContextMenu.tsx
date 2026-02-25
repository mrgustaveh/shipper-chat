import { IoChatbubbleOutline } from "react-icons/io5";
import { BsArchive, BsVolumeMute } from "react-icons/bs";
import { PiUserCircle } from "react-icons/pi";
import { TfiExport } from "react-icons/tfi";
import { GoTrash } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import { useChatStore } from "../../store/chat";
import "./contextmenu.scss";

type props = {
  chatId: string;
  closeContextMenu: () => void;
};

export const MessageContextMenu = ({ closeContextMenu }: props) => {
  const deleteChat = () => {
    useChatStore.setState({ chatMessages: [], selectedChatId: "" });
    closeContextMenu();
  };

  return (
    <div id="msg_context_menu">
      <button onClick={closeContextMenu}>
        <IoChatbubbleOutline size={18} /> Mark as unread
      </button>

      <button onClick={closeContextMenu}>
        <BsArchive size={18} /> Archive
      </button>

      <button onClick={closeContextMenu}>
        <BsVolumeMute size={18} /> Mute
      </button>

      <button>
        <PiUserCircle size={18} /> Contact info
      </button>

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
