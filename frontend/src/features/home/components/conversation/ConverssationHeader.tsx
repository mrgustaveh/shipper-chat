import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { LuPhone, LuVideo } from "react-icons/lu";
import { HiDotsHorizontal } from "react-icons/hi";
import { FloatingIndicator, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IoIosLink } from "react-icons/io";
import { FaFile } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useApiAuth } from "@/hooks/data/useapiauth";
import { useChats } from "@/hooks/data/usechats";
import { useChatStore } from "../../store/chat";
import { UiDrawer } from "@/components/ui/uiDrawer";
import { UiPopOver } from "@/components/ui/UiPopOver";
import { COLORS } from "@/lib/constants";
import type { Account } from "@/lib/api/entities";
import "./conversationheader.scss";

export const ConversationHeader = () => {
  const [opened, { open, close }] = useDisclosure();
  const [popoveropened, { open: openpopover, close: closepopover }] =
    useDisclosure();
  const selectedchatid = useChatStore((s) => s.selectedChatId);
  const { getAccountQuery } = useApiAuth();
  const { listChatsQuery } = useChats({});

  const activeChat = useMemo(() => {
    return listChatsQuery?.data?.find(
      (_chat) => _chat?.chatId === selectedchatid,
    );
  }, [selectedchatid, listChatsQuery?.data]);

  const renderuser: Account | undefined =
    getAccountQuery?.data?.accountId == activeChat?.user1?.accountId
      ? activeChat?.user2
      : activeChat?.user1;

  const closeChat = () => {
    useChatStore.setState({ selectedChatId: "" });
    closepopover();
  };

  return (
    <div id="conversation_header">
      <button
        className="profile_uname"
        onClick={open}
        disabled={selectedchatid == ""}
      >
        <img src={renderuser?.displayPic ?? "/icon-bg.png"} alt="profile pic" />
        {selectedchatid !== "" && (
          <p className="uname_status">
            {renderuser?.username}
            <span>Online</span>
          </p>
        )}
      </button>

      <div className="header_actions">
        <button disabled={selectedchatid == ""}>
          <FiSearch size={22} />
        </button>

        <button disabled={selectedchatid == ""}>
          <LuPhone size={22} />
        </button>

        <button disabled={selectedchatid == ""}>
          <LuVideo size={22} />
        </button>

        <UiPopOver
          target={
            <button
              onClick={() => (popoveropened ? closepopover() : openpopover())}
              disabled={selectedchatid == ""}
            >
              <HiDotsHorizontal size={18} />
            </button>
          }
          options={{
            opened: popoveropened,
            width: 200,
            trapFocus: true,
            withArrow: true,
            onChange: closepopover,
          }}
        >
          <button className="btn_close_chat" onClick={closeChat}>
            <RxCross2 size={18} color={COLORS.danger} /> Close Chat
          </button>
        </UiPopOver>
      </div>

      <UiDrawer
        isopen={opened}
        onclose={close}
        options={{
          title: "Contact Info",
          position: "right",
          transitionProps: { transition: "fade-left" },
        }}
      >
        <ContactInfo userInfo={renderuser} />
      </UiDrawer>
    </div>
  );
};

const ContactInfo = ({ userInfo }: { userInfo: Account | undefined }) => {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [value, setValue] = useState<string | null>("1");
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };

  return (
    <div id="contact_info">
      <div className="img_uname">
        <img
          src={userInfo?.displayPic ?? "/icon-bg.png"}
          alt="profile"
          loading="lazy"
        />
        <p>
          {userInfo?.username} <br /> <span>{userInfo?.email}</span>
        </p>
      </div>

      <div className="calls">
        <button>
          <LuPhone size={20} /> Audio
        </button>

        <button>
          <LuVideo size={20} /> Video
        </button>
      </div>

      <Tabs variant="none" value={value} onChange={setValue}>
        <Tabs.List ref={setRootRef} className="list">
          <Tabs.Tab value="1" ref={setControlRef("1")} className="tab">
            Media
          </Tabs.Tab>
          <Tabs.Tab value="2" ref={setControlRef("2")} className="tab">
            Links
          </Tabs.Tab>
          <Tabs.Tab value="3" ref={setControlRef("3")} className="tab">
            Docs
          </Tabs.Tab>

          <FloatingIndicator
            target={value ? controlsRefs[value] : null}
            parent={rootRef}
            className="indicator"
          />
        </Tabs.List>

        <Tabs.Panel value="1">
          <div className="media_images">
            <img src="/icon-bg.png" alt="media" loading="lazy" />
            <img src="/icon-bg.png" alt="media" loading="lazy" />
            <img src="/icon-bg.png" alt="media" loading="lazy" />
            <img src="/icon-bg.png" alt="media" loading="lazy" />
            <img src="/icon-bg.png" alt="media" loading="lazy" />
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="2">
          <div className="media_links_docs">
            <a
              href="https://mrgustaveh.github.io"
              target="_blank"
              referrerPolicy="no-referrer"
            >
              <span className="_icon_ctr">
                <IoIosLink size={24} />
              </span>
              https://mrgustaveh...
            </a>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="3">
          <div className="media_links_docs">
            <a
              href="https://mrgustaveh.github.io"
              target="_blank"
              referrerPolicy="no-referrer"
            >
              <span className="_icon_ctr">
                <FaFile size={24} />
              </span>
              https://mrgustaveh...
            </a>
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};
