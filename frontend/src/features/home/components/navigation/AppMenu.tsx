import { Divider, Progress } from "@mantine/core";
import { IoChevronBack, IoLogOutOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { GoGift } from "react-icons/go";
import { LuSunMedium } from "react-icons/lu";
import { useNavigate } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { useApiAuth } from "@/hooks/data/useapiauth";
import { COLORS } from "@/lib/constants";
import "./appmenu.scss";

export const AppMenu = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { getAccountQuery } = useApiAuth();

  const logOut = () => {
    signOut().then(() => {
      navigate("/");
    });
  };

  return (
    <div id="app_menu">
      <button className="menu_action goback">
        <span className="icon_ctr">
          <IoChevronBack size={16} color={COLORS.text_primary} />
        </span>
        Go back to dashboard
      </button>

      <button className="menu_action rename">
        <span className="icon_ctr">
          <CiEdit size={20} color={COLORS.text_primary} />
        </span>
        Rename file
      </button>

      <Divider style={{ margin: "0.25rem 0" }} />

      <div className="account_info">
        <span className="u_name">
          {getAccountQuery?.data?.username ?? "testing2"}
        </span>
        <span>{getAccountQuery?.data?.email ?? "testing2@gmail.com"}</span>
      </div>

      <div className="credits">
        <div className="credits_count">
          <p className="title_count">
            <span className="title">Credits</span>
            <span>20 left</span>
          </p>

          <p className="title_count align_end">
            <span className="title">Renews in</span>
            <span>6h 24m</span>
          </p>
        </div>

        <Progress
          value={60}
          style={{ margin: "0.25rem 0" }}
          color={COLORS.success}
        />

        <p className="used">
          <span>5 of 25 used today</span>
          <span>+25 tomorrow</span>
        </p>
      </div>

      <Divider style={{ margin: "0.25rem 0" }} />

      <button className="menu_action">
        <span className="icon_ctr">
          <GoGift size={19} color={COLORS.text_primary} />
        </span>
        Win free credits
      </button>

      <button className="menu_action">
        <span className="icon_ctr">
          <LuSunMedium size={22} color={COLORS.text_primary} />
        </span>
        Theme Style
      </button>

      <Divider style={{ margin: "0.25rem 0" }} />

      <button className="menu_action" onClick={logOut}>
        <span className="icon_ctr">
          <IoLogOutOutline size={22} color={COLORS.text_primary} />
        </span>
        Log out
      </button>
    </div>
  );
};
