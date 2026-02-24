import { useEffect } from "react";
import { useClerk, useAuth } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useNavigate } from "react-router";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { FiChevronsRight } from "react-icons/fi";
import {
  IoChatboxEllipses,
  IoChatboxEllipsesOutline,
  IoChatbubbles,
  IoChatbubblesOutline,
  IoChatbubbleEllipsesOutline,
  IoChatbubbleEllipsesSharp,
} from "react-icons/io5";
import { useApiAuth } from "@/hooks/data/useapiauth";
import { UiModal } from "@/components/ui/UiModal";
import { Loading } from "@/assets/animations";
import "./index.scss";

export default function Splash() {
  const { openSignIn, user } = useClerk();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure();
  const { createAccountMutation } = useApiAuth();

  const apiAuthCallBack = () => {
    notifications.show({
      title: "Setting things up",
      message: "Please wait...",
      loading: false,
      radius: "lg",
    });

    const assigned_username = `${user?.fullName?.substring(0, 4)?.toLowerCase()}${Math.floor(Math.random() * 10000)}`;

    createAccountMutation
      .mutateAsync({
        username: assigned_username,
        displayPic: user?.imageUrl ?? "",
        email: user?.emailAddresses?.[0]?.emailAddress ?? "",
      })
      .then(() => {
        close();
        navigate("/app");
      });
  };

  const onSignIn = () => {
    if (isSignedIn) {
      apiAuthCallBack();
    } else {
      openSignIn({
        oauthFlow: "popup",
        appearance: {
          theme: dark,
        },
      });
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      open();
      apiAuthCallBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  return (
    <section id="splash">
      <div id="els" className="els_above">
        <span className="els_icon_ctr">
          <IoChatbubbles className="els_icon" fontSize={32} />
        </span>

        <span className="els_icon_ctr mid">
          <IoChatboxEllipsesOutline className="els_icon" fontSize={32} />
        </span>

        <span className="els_icon_ctr">
          <IoChatboxEllipses className="els_icon" fontSize={32} />
        </span>
      </div>

      <button id="signin" onClick={onSignIn}>
        Get Started
        <span className="icon_ctr">
          <FiChevronsRight className="icon" fontSize={18} />
        </span>
      </button>

      <div id="els" className="els_below">
        <span className="els_icon_ctr">
          <IoChatbubbleEllipsesOutline className="els_icon" fontSize={32} />
        </span>

        <span className="els_icon_ctr mid">
          <IoChatbubbleEllipsesSharp className="els_icon" fontSize={32} />
        </span>

        <span className="els_icon_ctr">
          <IoChatbubblesOutline className="els_icon" fontSize={32} />
        </span>
      </div>

      <UiModal
        opened={opened}
        close={close}
        modaloptions={{
          centered: true,
          shadow: "sm",
          padding: "sm",
          closeOnEscape: false,
          closeOnClickOutside: false,
        }}
      >
        <div id="animation_ctr">
          <Loading width="8rem" height="8rem" />
        </div>
      </UiModal>
    </section>
  );
}
