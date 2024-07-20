import { memo} from "react";
import MessageBox from "./MessageBox";
import Messages from "./Messages";
import { useChat } from "../context/chatContext";

function ChatBox() {
  const { data } = useChat();

  if (data.roomId == null) {
    return (
      <div className="grid place-content-center h-[440px] rounded-br-xl rounded-bl-xl sm:rounded-bl-none bg-blue-200">
        <h2 className="text-3xl font-bold text-white text-center px-2">
          Choose a chat to start the conversation
        </h2>
      </div>
    );
  }

  return (
    <>
      <div className="h-[380px] bg-blue-200 space-y-7 p-2 overflow-auto">
        <Messages />
      </div>
      {/* SEND MESSAGE*/}
      <MessageBox />
    </>
  );
}

export default memo(ChatBox);
