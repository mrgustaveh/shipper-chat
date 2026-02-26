import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RxCross2 } from "react-icons/rx";
import { TbSend } from "react-icons/tb";
import "./aichat.scss";

type props = {
  onclose: () => void;
};

const chatschema = z.object({
  message: z.string(),
});

type chatschematype = z.infer<typeof chatschema>;

export const AiChat = ({ onclose }: props) => {
  const { register, reset, handleSubmit, watch } = useForm<chatschematype>({
    resolver: zodResolver(chatschema),
  });

  const submitPrompt = (args: chatschematype) => {
    console.log(args);
    reset();
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const MESSAGE = watch("message");

  return (
    <div id="ai_conversation">
      <div className="title_close">
        <p>AI Chat</p>

        <button onClick={onclose}>
          <RxCross2 size={18} />
        </button>
      </div>

      <form className="ai_input" onSubmit={handleSubmit(submitPrompt)}>
        <input
          type="text"
          autoFocus
          placeholder="Ask me anything..."
          {...register("message")}
        />

        <button type="submit" disabled={MESSAGE == ""}>
          <TbSend size={20} />
        </button>
      </form>
    </div>
  );
};
