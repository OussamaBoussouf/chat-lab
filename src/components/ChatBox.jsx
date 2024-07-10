import profilImage from "../assets/img/profil-image.jpg";
import { memo, useState } from "react";
import MessageBox from "./MessageBox";

const fakeMessages = [
  {
    name: "alex",
    msg: "Hi how are you?",
  },
  {
    name: "sam",
    msg: "fine, how about you?",
  },
];

function ChatBox() {

  const [messages, setMessages] = useState(fakeMessages);

  const updateMessages = (value) => {
    setMessages([...messages, {name: "alex", msg: value}]);
  }


  return (
    <>
      <div className="h-[380px] bg-blue-200 space-y-7 p-2 overflow-auto">
        {messages.map((message, index) => (
          <div  key={index}
            className={`flex items-end chat gap-4 ${
              message.name == "alex"
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
                message.name == "alex"
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
      <MessageBox updateMessages={updateMessages}/>
    </>
  );
}

export default memo(ChatBox);
