import { useEffect } from "react";
import { useClerk, useAuth } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useNavigate } from "react-router";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Divider } from "@mantine/core";
import { FiChevronsRight } from "react-icons/fi";
import { useApiAuth } from "@/hooks/data/useapiauth";
import { UiModal } from "@/components/ui/UiModal";
import { Loading } from "@/assets/animations";
import { SquigglyWave } from "@/assets/Illustrations";
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
      <div id="svg_animation_ctr">
        <SquigglyWave />
      </div>

      <div id="contents">
        <div className="intro">
          <img src="/icon-bg.png" alt="icon" />
          <span>♥️ Loved by 1M+ People</span>
        </div>
        <p className="intro_name">
          Introducing <span>Shipper - Chat</span>, <br /> The <span>Best</span>{" "}
          way to <span>Chat.</span>
        </p>
        <button id="signin" onClick={onSignIn}>
          Get Started
          <span className="icon_ctr">
            <FiChevronsRight className="icon" fontSize={18} />
          </span>
        </button>

        <div className="previews">
          {preview_avatars.map((_avatar, idx) => (
            <div className="skeleton_ctr" key={idx}>
              <div className="img_uname">
                <img src={_avatar.image} alt="avatar" />
                <span className="user_name">@{_avatar.name}</span>
              </div>

              <Divider style={{ margin: "0.5rem 0" }} />

              <p className="msg">Lorem ipsum dolor sit...</p>
              <span className="time">2 mins ago</span>
            </div>
          ))}
        </div>
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

type preview = {
  name: string;
  image: string;
};

const preview_avatars: preview[] = [
  {
    name: "oliver",
    image: "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Oliver",
  },
  {
    name: "ryan",
    image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Ryan",
  },
  {
    name: "george",
    image: "https://api.dicebear.com/9.x/open-peeps/svg?seed=George",
  },
  {
    name: "aiden",
    image: "https://api.dicebear.com/9.x/open-peeps/svg?seed=Oliver",
  },
  {
    name: "valentina",
    image: "https://api.dicebear.com/9.x/toon-head/svg?seed=Valentina",
  },
];
