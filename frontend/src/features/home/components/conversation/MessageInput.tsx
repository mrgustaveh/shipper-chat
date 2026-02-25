import { useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip, Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import {
  IoMicOutline,
  IoStopCircleOutline,
  IoTrashOutline,
} from "react-icons/io5";
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
});

type schematype = z.infer<typeof schema>;

export const MessageInput = () => {
  const {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useVoiceRecorder();

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

  const onSendMessage = (args: schematype) => {
    const text = args.message || "";
    if (!text.trim()) return;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const links = text.match(urlRegex) || [];

    sendMessage(text, [], links, []);
    form.reset();
  };

  const handleSendVoiceMessage = async (file: File) => {
    try {
      const res = await uploadMediaMutation.mutateAsync({ file });
      sendMessage("", [], [], [], res.url);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      notifications.show({
        title: "Upload failed",
        message: "We couldn't send your voice message, try again",
        color: "orange",
        radius: "lg",
      });
    }
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadMediaMutation.mutateAsync({ file });
      const isImage = file.type.startsWith("image/");
      sendMessage("", isImage ? [res.url] : [], [], isImage ? [] : [res.url]);
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

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <form id="messageinput" onSubmit={form.handleSubmit(onSendMessage)}>
      {isRecording ? (
        <div className="recording_active">
          <div className="recording_indicator">
            <div className="red_dot animate-pulse"></div>
            <span>Recording... {formatTime(recordingTime)}</span>
          </div>

          <div className="recording_actions">
            <Tooltip label="Cancel" withArrow>
              <button
                type="button"
                className="cancel_btn"
                onClick={cancelRecording}
              >
                <IoTrashOutline size={20} color="red" />
              </button>
            </Tooltip>

            <Tooltip label="Send voice message" withArrow>
              <button
                type="button"
                className="stop_btn"
                onClick={async () => {
                  const file = await stopRecording();
                  if (file) {
                    await handleSendVoiceMessage(file);
                  }
                }}
                disabled={uploadMediaMutation.isPending}
              >
                {uploadMediaMutation.isPending ? (
                  <Loader size={16} color="blue" />
                ) : (
                  <IoStopCircleOutline size={22} color="blue" />
                )}
              </button>
            </Tooltip>
          </div>
        </div>
      ) : (
        <>
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
              <button
                type="button"
                disabled={selectedchatid == ""}
                onClick={startRecording}
              >
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
              options={{
                width: 200,
                trapFocus: true,
                withArrow: true,
                offset: 0,
              }}
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
                  !MESSAGE?.trim() ||
                  uploadMediaMutation.isPending
                }
              >
                <TbSend size={20} />
              </button>
            </Tooltip>
          </div>
        </>
      )}
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
