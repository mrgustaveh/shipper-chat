import {
  IoChatbubbleOutline,
  IoSettingsOutline,
  IoChevronDown,
} from "react-icons/io5";
import { BsBell } from "react-icons/bs";
import { useApiAuth } from "@/hooks/data/useapiauth";
import { SearchInput } from "./Search";
import "./header.scss";

export const ChatHeader = () => {
  const { getAccountQuery } = useApiAuth();

  return (
    <div id="chatheader">
      <span className="title">
        <IoChatbubbleOutline size={24} />
        Message
      </span>

      <div className="search_actions">
        <SearchInput />

        <button className="header_action">
          <BsBell size={20} />
        </button>

        <button className="header_action">
          <IoSettingsOutline size={20} />
        </button>

        <div className="divider"></div>

        <button className="details">
          <img
            src={getAccountQuery?.data?.displayPic ?? "/icon-bg.png"}
            alt="profile pic"
            loading="lazy"
          />
          <IoChevronDown size={16} />
        </button>
      </div>
    </div>
  );
};
