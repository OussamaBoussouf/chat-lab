import { memo, useEffect, useRef, useState } from "react";
import { useChat } from "../context/chatContext";
import MessageBox from "./MessageBox";
import { useAuth } from "../context/authContext";
import { db } from "../fireStore";
import { doc, onSnapshot } from "firebase/firestore";


function ChatBox({ selectRoom }) {
  const { chatRoomMessages, loading } = useChat();
  const { user } = useAuth();
  const [connectedUserImage, setConnectedUserImage] = useState("");
  const [secondUserImage, setSecondUserImage] = useState("");
  const chatBox = useRef(null);

  useEffect(() => {
    if (!selectRoom) return;
    const unsubscribe = onSnapshot(doc(db, "users", selectRoom), (doc) => {
      setSecondUserImage(doc.data().profileImage);
    })
    return () => unsubscribe();
  }, [selectRoom]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", user.userId), (doc) => {
      setConnectedUserImage(doc.data().profileImage);
    })
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (chatRoomMessages.length && chatBox.current.scrollHeight > 380) {
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
      <div
        ref={chatBox}
        className="h-[380px] bg-blue-200 space-y-7 p-2 overflow-auto"
      >
        {loading && (
          <span className="loading loading-dots loading-lg text-indigo-500 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>
        )}
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
                src={
                  user.userName == message.name
                    ? connectedUserImage
                    : secondUserImage
                    // ? imageUrl
                    // : avatar
                }
                alt="profil image"
              />
            </div>
            <div
              className={`chat-bubble ${
                message.name == user.userName
                  ? "bg-blue-400 text-white"
                  : "bg-white text-black"
              } break-all`}
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
