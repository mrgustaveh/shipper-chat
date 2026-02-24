import { ChatHeader } from "./components/chatheader/ChatHeader";
import { NavBar } from "./components/navigation/Nav";
import "./index.scss";

export default function Home() {
  return (
    <section id="home">
      <div id="left">
        <NavBar />
      </div>

      <div id="right">
        <ChatHeader />
      </div>
    </section>
  );
}
