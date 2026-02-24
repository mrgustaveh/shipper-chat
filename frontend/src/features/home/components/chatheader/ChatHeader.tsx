import {
  IoChatbubbleOutline,
  IoSettingsOutline,
  IoChevronDown,
} from "react-icons/io5";
import { BsBell } from "react-icons/bs";
import { useApiAuth } from "@/hooks/data/useapiauth";
import { UiPopOver } from "@/components/ui/UiPopOver";
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

        <UiPopOver
          target={
            <button className="header_action">
              <BsBell size={20} />
            </button>
          }
          options={{ width: 200, withArrow: true, offset: 4 }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 400,
              textAlign: "center",
            }}
          >
            You're all caught up.
          </p>
        </UiPopOver>

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
