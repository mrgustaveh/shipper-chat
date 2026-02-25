import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip } from "@mantine/core";
import { IoMicOutline } from "react-icons/io5";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { GrAttachment } from "react-icons/gr";
import { TbSend } from "react-icons/tb";
import { useRealTimeChat } from "@/hooks/websocket/usertchat";
import { useChatStore } from "../../store/chat";
import { UiPopOver } from "@/components/ui/UiPopOver";
import "./messageinput.scss";

const schema = z.object({
  message: z.string().optional(),
  mediaUrl: z.url().optional(),
});

type schematype = z.infer<typeof schema>;

export const MessageInput = () => {
  const selectedchatid = useChatStore((s) => s.selectedChatId);

  const { sendMessage, sendTyping } = useRealTimeChat({
    chatId: selectedchatid,
  });

  const form = useForm<schematype>({
    resolver: zodResolver(schema),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const MESSAGE = form.watch("message");
  const MEDIA_URL = form.watch("mediaUrl");

  const onSendMessage = (args: schematype) => {
    sendMessage(args.message!);
    form.reset();
  };

  return (
    <form id="messageinput" onSubmit={form.handleSubmit(onSendMessage)}>
      <input
        type="text"
        placeholder="Type any message..."
        autoComplete="off"
        autoCapitalize="off"
        disabled={selectedchatid == ""}
        onKeyUp={() => sendTyping(true)}
        {...form.register("message")}
      />

      <div className="input_actions">
        <Tooltip label="Record voice message" withArrow>
          <button disabled={selectedchatid == ""}>
            <IoMicOutline size={22} />
          </button>
        </Tooltip>

        <UiPopOver
          target={
            <Tooltip label="Find an emoji" withArrow>
              <button type="button" disabled={selectedchatid == ""}>
                <MdOutlineEmojiEmotions size={22} />
              </button>
            </Tooltip>
          }
          options={{ width: 200, trapFocus: true, withArrow: true, offset: 0 }}
        >
          <EmojiPicker
            pickEmoji={(emoji) =>
              form.setValue(
                "message",
                `${form.getValues("message") || ""}${emoji}`,
              )
            }
          />
        </UiPopOver>

        <Tooltip label="Send a image or file" withArrow>
          <button disabled={selectedchatid == ""}>
            <GrAttachment size={18} />
          </button>
        </Tooltip>

        <Tooltip label="Send (Enter)" withArrow>
          <button
            type="submit"
            className="send_message"
            disabled={selectedchatid == "" || MESSAGE == "" || MEDIA_URL == ""}
          >
            <TbSend size={20} />
          </button>
        </Tooltip>
      </div>
    </form>
  );
};

const EmojiPicker = ({ pickEmoji }: { pickEmoji: (emoji: string) => void }) => {
  const EMOJIS = [
    "🇰🇪",
    "🙂",
    "👌",
    "⛄",
    "🦉",
    "☯️",
    "🧭",
    "🔥",
    "🎉",
    "🃏",
    "🕶️",
    "📷",
    "☢️",
    "💯",
    "👋",
    "☀️",
    "⚽",
    "🎒",
    "🛩",
    "🥳",
    "🪐",
  ];

  return (
    <div id="emoji_picker">
      {EMOJIS.map((_em) => (
        <button onClick={() => pickEmoji(_em)}>{_em}</button>
      ))}
    </div>
  );
};
