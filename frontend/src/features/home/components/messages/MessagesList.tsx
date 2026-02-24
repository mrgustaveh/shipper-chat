import { RiCheckDoubleFill } from "react-icons/ri";
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
  );
};
