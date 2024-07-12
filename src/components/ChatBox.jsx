import { memo, useLayoutEffect, useRef } from "react";
import profilImage from "../assets/img/profil-image.jpg";
import { useChat } from "../context/chatContext";
import MessageBox from "./MessageBox";
import { useAuth } from "../context/authContext";

function ChatBox({ selectRoom }) {
  const { chatRoomMessages } = useChat();
  const { user } = useAuth();
  const chatBox = useRef(null);

  useLayoutEffect(() => {
    if (chatRoomMessages.length && chatBox.current.scrollHeight > 380 ) {
      chatBox.current.scrollTop = chatBox.current.scrollHeight;
    }
  }, [chatRoomMessages]);

  if (!selectRoom) {
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
      <div ref={chatBox} className="h-[380px] bg-blue-200 space-y-7 p-2 overflow-auto">
        {chatRoomMessages.map((message, index) => (
          <div
            key={index}
            className={`flex items-end chat gap-4 ${
              message.name == user.userName
                ? "chat-end flex-row-reverse"
                : "chat-start"
            }`}
          >
            <div className="flex-shrink-0">
              <img
                w={50}
                h={50}
                className="w-[50px] h-[50px] rounded-full"
                src={profilImage}
                alt="profil image"
              />
            </div>
            <div
              className={`chat-bubble ${
                message.name == user.userName
                  ? "bg-blue-400 text-white"
                  : "bg-white text-black"
              } `}
            >
              {message.msg}
            </div>
          </div>
        ))}
      </div>
      {/* SEND MESSAGE*/}
      <MessageBox />
    </>
  );
}

export default memo(ChatBox);
