import type { ReactNode } from "react";
import { Tooltip } from "@mantine/core";
import { RiHome2Line } from "react-icons/ri";
import { IoChatbubbleOutline, IoFolderOutline } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { LuImage } from "react-icons/lu";
import { useApiAuth } from "@/hooks/data/useapiauth";
import { PiStarFour } from "react-icons/pi";
import "./nav.scss";

type navaction = {
  name: "home" | "chat" | "explore" | "folders" | "images";
  tootltiptitle: string;
  icon: ReactNode;
  onclickhandler: () => void;
};

export const NavBar = () => {
  const { getAccountQuery } = useApiAuth();

  const navactions: navaction[] = [
    {
      name: "home",
      tootltiptitle: "Home",
      icon: <RiHome2Line size={24} />,
      onclickhandler: () => {},
    },
    {
      name: "chat",
      tootltiptitle: "Chat",
      icon: <IoChatbubbleOutline size={24} />,
      onclickhandler: () => {},
    },
    {
      name: "explore",
      tootltiptitle: "Explore",
      icon: <MdOutlineExplore size={24} />,
      onclickhandler: () => {},
    },
    {
      name: "folders",
      tootltiptitle: "Folders",
      icon: <IoFolderOutline size={24} />,
      onclickhandler: () => {},
    },
    {
      name: "images",
      tootltiptitle: "Images",
      icon: <LuImage size={24} />,
      onclickhandler: () => {},
    },
  ];

  return (
    <nav id="left_nav">
      <div className="top">
        <Tooltip label="Menu" withArrow>
          <button className="app_menu">
            <img
              src="/icon-bg.png"
              alt="icon"
              className="icon"
              loading="lazy"
            />
          </button>
        </Tooltip>

        {navactions.map((_action) => (
          <Tooltip label={_action.tootltiptitle} withArrow>
            <button
              className={`nav_action ${_action.name == "chat" ? "active" : ""}`}
              onClick={_action.onclickhandler}
            >
              {_action.icon}
            </button>
          </Tooltip>
        ))}
      </div>

      <div className="bottom">
        <Tooltip label="Ai Chat" withArrow>
          <button className="nav_action">
            <PiStarFour size={24} />
          </button>
        </Tooltip>

        <img
          src={getAccountQuery?.data?.displayPic ?? "/icon-bg.png"}
          alt="icon"
          className="profile_pic"
          loading="lazy"
        />
      </div>
    </nav>
  );
};
