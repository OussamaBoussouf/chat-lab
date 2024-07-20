import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/authContext";
import { auth, db } from "../fireStore";
import { useChat } from "../context/chatContext";
import { doc, onSnapshot } from "firebase/firestore";

function Messages() {
  const { user } = useAuth();
  const ref = useRef(null);
  const { data } = useChat();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "rooms", data.roomId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => unsub();
  }, [data.roomId]);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {messages?.map((message, index) => (
        <div
          ref={ref}
          key={index}
          className={`flex items-end chat gap-4 ${
            message.name == user.displayName
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
                message.name === user.displayName
                  ? auth.currentUser.photoURL
                  : data.friend.photoURL
              }
              alt="profil image"
            />
          </div>
          <div
            className={`chat-bubble ${
              message.name == user.displayName
                ? "bg-blue-400 text-white"
                : "bg-white text-black"
            } break-all`}
          >
            {message.msg}
          </div>
        </div>
      ))}
    </>
  );
}

export default Messages;
