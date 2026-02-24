import { Tooltip } from "@mantine/core";
import { IoMicOutline } from "react-icons/io5";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { GrAttachment } from "react-icons/gr";
import { TbSend } from "react-icons/tb";
import "./messageinput.scss";

export const MessageInput = () => {
  return (
    <form id="messageinput">
      <input type="text" placeholder="Type any message..." />

      <div className="input_actions">
        <Tooltip label="Record voice message" withArrow>
          <button>
            <IoMicOutline size={22} />
          </button>
        </Tooltip>

        <Tooltip label="Find an emoji" withArrow>
          <button>
            <MdOutlineEmojiEmotions size={22} />
          </button>
        </Tooltip>

        <Tooltip label="Send a image or file" withArrow>
          <button>
            <GrAttachment size={18} />
          </button>
        </Tooltip>

        <Tooltip label="Send (Enter)" withArrow>
          <button className="send_message">
            <TbSend size={20} />
          </button>
        </Tooltip>
      </div>
    </form>
  );
};
