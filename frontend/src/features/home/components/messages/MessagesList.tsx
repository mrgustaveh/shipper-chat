import { RiCheckDoubleFill } from "react-icons/ri";
// import { IoChatbubbleOutline } from "react-icons/io5";
// import { BsArchive, BsVolumeMute } from "react-icons/bs";
// import { PiUserCircle } from "react-icons/pi";
// import { TfiExport } from "react-icons/tfi";
// import { GoTrash } from "react-icons/go";
// import { RxCross2 } from "react-icons/rx";
// import { UiPopOver } from "@/components/ui/UiPopOver";
import { COLORS } from "@/lib/constants";
import "./messageslist.scss";

export const MessagesList = () => {
  return (
    <div id="messages_list">
      <MessagePreview />
      <MessagePreview />
      <MessagePreview />
    </div>
  );
};

const MessagePreview = () => {
  return (
    <button id="message_preview">
      <img src="/icon-bg.png" alt="profile picture" loading="lazy" />

      <div className="_msg_details">
        <p>
          Adrian Kurt
          <span>12 min ago</span>
        </p>

        <p>
          <span>Thanks for the explanation!</span>
          <RiCheckDoubleFill size={16} color={COLORS.success} />
        </p>
      </div>
    </button>

    // <div id="menu_dropdown">
    //   <button>
    //     <IoChatbubbleOutline size={18} /> Mark as unread
    //   </button>
    //   <button>
    //     <BsArchive size={18} /> Archive
    //   </button>
    //   <button>
    //     <BsVolumeMute size={18} /> Mute
    //   </button>
    //   <button>
    //     <PiUserCircle size={18} /> Contact info
    //   </button>
    //   <button>
    //     <TfiExport size={18} />
    //     Export chat
    //   </button>
    //   <button>
    //     <RxCross2 size={18} />
    //     Clear chat
    //   </button>
    //   <button className="delete">
    //     <GoTrash size={18} /> Delete chat
    //   </button>
    // </div>
  );
};
