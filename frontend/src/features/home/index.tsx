import { NavBar } from "./components/navigation/Nav";
import { ChatHeader } from "./components/chatheader/ChatHeader";
import { CreateMessage } from "./components/messages/Create";
import { SearchFilter } from "./components/messages/Filter";
import { MessagesList } from "./components/messages/MessagesList";
import "./index.scss";

export default function Home() {
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

          <div id="chat_container">chat container</div>
        </div>
      </div>
    </section>
  );
}
