import { NavBar } from "./components/navigation/Nav";
// import { SearchBar } from "./components/search";
// import { Channels } from "./components/channels";
// import { Account } from "./components/account";
// import { Messsages } from "./components/conversation/Messages";
// import { ChatInput } from "./components/conversation/ChatInput";
import "./index.scss";

export default function Home() {
  return (
    <section id="home">
      <div id="left">
        <NavBar />
      </div>

      <div id="right">
        <p>right</p>
      </div>
    </section>
  );
}
