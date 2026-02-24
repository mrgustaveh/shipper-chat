import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { LuPhone, LuVideo } from "react-icons/lu";
import { HiDotsHorizontal } from "react-icons/hi";
import { FloatingIndicator, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IoIosLink } from "react-icons/io";
import { FaFile } from "react-icons/fa6";
import { UiDrawer } from "@/components/ui/uiDrawer";
import "./conversationheader.scss";

export const ConversationHeader = () => {
  const [opened, { open, close }] = useDisclosure();

  return (
    <div id="conversation_header">
      <div className="profile_uname" onClick={open}>
        <img src="/icon-bg.png" alt="profile pic" />
        <p className="uname_status">
          Daniel H.
          <span>Online</span>
        </p>
      </div>

      <div className="header_actions">
        <button>
          <FiSearch size={22} />
        </button>

        <button>
          <LuPhone size={22} />
        </button>

        <button>
          <LuVideo size={22} />
        </button>

        <button>
          <HiDotsHorizontal size={18} />
        </button>
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
        <ContactInfo />
      </UiDrawer>
    </div>
  );
};

const ContactInfo = () => {
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
        <img src="/icon-bg.png" alt="profile" loading="lazy" />
        <p>
          Daniel CH <br /> <span>daniel@gmail.com</span>
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
