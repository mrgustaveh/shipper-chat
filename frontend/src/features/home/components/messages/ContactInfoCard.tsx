import { useMemo } from "react";
import { Divider } from "@mantine/core";
import { useApiAuth } from "@/hooks/data/useapiauth";
import "./contactinfocard.scss";

type props = {
  userId: string;
};

export const ContactCardInfo = ({ userId }: props) => {
  const { listUsersQuery } = useApiAuth();

  const user = useMemo(() => {
    return listUsersQuery?.data?.find((u) => u.accountId === userId);
  }, [userId]);

  return (
    <div id="contact_card_info">
      <img src={user?.displayPic ?? "/icon-bg.png"} alt="profile" />

      <Divider style={{ width: "90%", margin: "0.375rem 0" }} />

      <div className="name">
        <span className="uname">{user?.username}</span>
        <span className="email">{user?.email}</span>
      </div>
    </div>
  );
};
