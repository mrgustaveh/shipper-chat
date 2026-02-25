import { useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip, Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IoMicOutline } from "react-icons/io5";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { GrAttachment } from "react-icons/gr";
import { TbSend } from "react-icons/tb";
import { useRealTimeChat } from "@/hooks/websocket/usertchat";
import { useChatStore } from "../../store/chat";
import { useChats } from "@/hooks/data/usechats";
import { UiPopOver } from "@/components/ui/UiPopOver";
import "./messageinput.scss";

const schema = z.object({
  message: z.string().optional(),
  mediaUrl: z.string().url().optional().or(z.literal("")),
  mediaType: z.enum(["image", "doc"]).optional(),
});

type schematype = z.infer<typeof schema>;

export const MessageInput = () => {
  const selectedchatid = useChatStore((s) => s.selectedChatId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { sendMessage, sendTyping } = useRealTimeChat({
    chatId: selectedchatid,
  });

  const { uploadMediaMutation } = useChats({ chatId: selectedchatid });

  const form = useForm<schematype>({
    resolver: zodResolver(schema),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const MESSAGE = form.watch("message");
  const MEDIA_URL = form.watch("mediaUrl");

  const onSendMessage = (args: schematype) => {
    const text = args.message || "";
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const links = text.match(urlRegex) || [];

    const media =
      args.mediaUrl && args.mediaType === "image" ? [args.mediaUrl] : [];
    const docs =
      args.mediaUrl && args.mediaType === "doc" ? [args.mediaUrl] : [];

    sendMessage(text, media, links, docs);
    form.reset();
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadMediaMutation.mutateAsync({ file });
      form.setValue("mediaUrl", res.url);
      form.setValue(
        "mediaType",
        file.type.startsWith("image/") ? "image" : "doc",
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      notifications.show({
        title: "Upload failed",
        message: "We couldn't save your file, try again",
        color: "orange",
        radius: "lg",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

        <Tooltip label="Send an image or file" withArrow>
          <button
            type="button"
            disabled={selectedchatid == "" || uploadMediaMutation.isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadMediaMutation.isPending ? (
              <Loader size={12} color="gray" />
            ) : (
              <GrAttachment size={18} />
            )}
          </button>
        </Tooltip>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
          onChange={onFileSelected}
        />

        <Tooltip label="Send (Enter)" withArrow>
          <button
            type="submit"
            className="send_message"
            disabled={
              selectedchatid == "" ||
              (!MESSAGE?.trim() && !MEDIA_URL) ||
              uploadMediaMutation.isPending
            }
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
