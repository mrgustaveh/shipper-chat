import { useEffect, useRef, useCallback } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/clerk-react";
import ReactMarkdown from "react-markdown";
import { RxCross2 } from "react-icons/rx";
import { TbSend } from "react-icons/tb";
import { VscSparkle } from "react-icons/vsc";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { IoChevronBack } from "react-icons/io5";
import { useAiChatStore, type AiConversation } from "../../store/ai";
import { BASE_URL, AI_ENDPOINTS } from "@/lib/api/config";
import { COLORS } from "@/lib/constants";
import "./aichat.scss";

type props = {
  onclose: () => void;
};

const chatschema = z.object({
  message: z.string().min(1),
});

type chatschematype = z.infer<typeof chatschema>;

export const AiChat = ({ onclose }: props) => {
  const { getToken } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasFetched = useRef(false);

  const {
    conversations,
    activeConversationId,
    messages,
    isStreaming,
    error,
    setConversations,
    setActiveConversation,
    addConversation,
    removeConversation,
    addMessage,
    updateLastAssistantMessage,
    setStreaming,
    setError,
  } = useAiChatStore();

  const { register, reset, handleSubmit, watch } = useForm<chatschematype>({
    resolver: zodResolver(chatschema),
  });

  const MESSAGE = watch("message");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations on mount
  const fetchConversations = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await fetch(BASE_URL + AI_ENDPOINTS.conversations, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data: AiConversation[] = await res.json();
      setConversations(data);
      if (data.length > 0 && !activeConversationId) {
        setActiveConversation(data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch AI conversations:", err);
    }
  }, [getToken, setConversations, setActiveConversation, activeConversationId]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchConversations();
    }
  }, [fetchConversations]);

  const createNewConversation = async () => {
    try {
      const token = await getToken();
      const res = await fetch(BASE_URL + AI_ENDPOINTS.conversations, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      if (!res.ok) return;
      const convo: AiConversation = await res.json();
      addConversation(convo);
      setActiveConversation(convo.id);
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  };

  // Delete a conversation
  const deleteConversation = async (id: string) => {
    try {
      const token = await getToken();
      await fetch(BASE_URL + AI_ENDPOINTS.conversations + `/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      removeConversation(id);
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  const submitPrompt = async (args: chatschematype) => {
    const userMessage = args.message.trim();
    if (!userMessage || isStreaming) return;

    // Auto-create a conversation if none exists
    let convoId = activeConversationId;
    if (!convoId) {
      try {
        const token = await getToken();
        const res = await fetch(BASE_URL + AI_ENDPOINTS.conversations, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });
        if (!res.ok) return;
        const convo: AiConversation = await res.json();
        addConversation(convo);
        setActiveConversation(convo.id);
        convoId = convo.id;
      } catch (err) {
        console.error("Failed to create conversation:", err);
        return;
      }
    }

    reset();

    addMessage({ role: "user", content: userMessage });
    addMessage({ role: "assistant", content: "" });
    setStreaming(true);

    try {
      const token = await getToken();
      const allMessages = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: userMessage },
      ];

      const response = await fetch(BASE_URL + AI_ENDPOINTS.chat, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: allMessages,
          conversationId: convoId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response stream");

      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        updateLastAssistantMessage(accumulated);
      }

      // Refresh conversations to get updated title
      await fetchConversations();
    } catch (err) {
      console.error("AI chat error:", err);
      setError("Something went wrong. Please try again.");
      updateLastAssistantMessage(
        "Sorry, I encountered an error. Please try again.",
      );
    } finally {
      setStreaming(false);
    }
  };

  const showConversationList =
    !activeConversationId || conversations.length === 0;

  return (
    <div id="ai_conversation">
      <div className="title_close">
        <div className="title_left">
          {activeConversationId && conversations.length > 0 && (
            <button
              className="back_btn"
              onClick={() => setActiveConversation(null)}
              title="All conversations"
            >
              <IoChevronBack size={16} />
            </button>
          )}
          <VscSparkle size={18} />
          <p>{activeConversationId ? "AI Chat" : "Conversations"}</p>
        </div>

        <div className="title_actions">
          {activeConversationId && (
            <button
              className="action_btn"
              onClick={() => deleteConversation(activeConversationId)}
              title="Delete conversation"
            >
              <FiTrash2 size={15} />
            </button>
          )}

          <button
            className="action_btn"
            onClick={createNewConversation}
            title="New conversation"
          >
            <FiPlus size={17} />
          </button>

          <button className="close_btn" onClick={onclose}>
            <RxCross2 size={18} />
          </button>
        </div>
      </div>

      {showConversationList && !activeConversationId ? (
        <div className="conversation_list">
          {conversations.length === 0 ? (
            <div className="empty_state">
              <VscSparkle size={32} />
              <p className="empty_title">ShipperChat AI</p>
              <p className="empty_desc">
                Start a new conversation to ask questions, compose messages, or
                get help.
              </p>
              <button className="new_chat_btn" onClick={createNewConversation}>
                <FiPlus size={20} color={COLORS.bg_secondary} />
                New Conversation
              </button>
            </div>
          ) : (
            conversations.map((convo) => (
              <button
                key={convo.id}
                className="conversation_item"
                onClick={() => setActiveConversation(convo.id)}
              >
                <div className="convo_info">
                  <p className="convo_title">{convo.title}</p>
                  <p className="convo_meta">
                    {convo.messages.length} message
                    {convo.messages.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  className="convo_delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(convo.id);
                  }}
                >
                  <FiTrash2 size={13} />
                </button>
              </button>
            ))
          )}
        </div>
      ) : (
        <>
          <div className="ai_messages">
            {messages.length === 0 ? (
              <div className="empty_state">
                <VscSparkle size={32} />
                <p className="empty_title">ShipperChat AI</p>
                <p className="empty_desc">
                  Ask me anything — compose messages, get suggestions, or just
                  have a conversation.
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`ai_message ${msg.role}`}>
                  {msg.role === "assistant" ? (
                    <div className="assistant_content">
                      {msg.content ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : isStreaming && idx === messages.length - 1 ? (
                        <div className="typing_indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="user_content">
                      <p>{msg.content}</p>
                    </div>
                  )}
                </div>
              ))
            )}

            {error && <p className="error_message">{error}</p>}
            <div ref={messagesEndRef} />
          </div>

          <form className="ai_input" onSubmit={handleSubmit(submitPrompt)}>
            <input
              type="text"
              autoFocus
              autoComplete="off"
              placeholder="Ask me anything..."
              disabled={isStreaming}
              {...register("message")}
            />

            <button
              type="submit"
              disabled={!MESSAGE || MESSAGE === "" || isStreaming}
            >
              <TbSend size={20} />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
