import { NavBar } from "./components/navigation/Nav";
import { ChatHeader } from "./components/chatheader/ChatHeader";
import { CreateMessage } from "./components/messages/Create";
import { SearchFilter } from "./components/messages/Filter";
import { MessagesList } from "./components/messages/MessagesList";
import { ConversationHeader } from "./components/conversation/ConverssationHeader";
import { ConversationMesssages } from "./components/conversation/ConversationMessages";
import { MessageInput } from "./components/conversation/MessageInput";
import { usePresence } from "@/hooks/websocket/usePresence";
import "./index.scss";

export default function Home() {
  usePresence();

  return (
    <section id="home">
      <div id="left">
        <NavBar />
      </div>

      <div id="right">
        <ChatHeader />

        <div id="lower">
          <div id="messages">
            <CreateMessage />
            <SearchFilter />
            <MessagesList />
          </div>

          <div id="chat_container">
            <ConversationHeader />
            <ConversationMesssages />
            <MessageInput />
          </div>
        </div>
      </div>
    </section>
  );
}
