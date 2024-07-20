import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import HeaderBar from "../components/HeaderBar";
import { useState } from "react";
import { ChatProvider } from "../context/chatContext";

function ChatRoom() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };


  return (
    <ChatProvider>
      <div className="overflow-hidden flex items-center justify-center h-screen bg-blue-400">
        <Sidebar
          handleToggle={handleToggle}
          isOpen={isSidebarOpen}
        />
        <div className="h-[500px] relative w-[600px] rounded-tr-xl rounded-br-xl">
          {/* CHAT HEADING */}
          <HeaderBar handleToggle={handleToggle} />
          {/* CONVERSATION BOX*/}
          <ChatBox/>
        </div>
      </div>
    </ChatProvider>
  );
}

export default ChatRoom;
