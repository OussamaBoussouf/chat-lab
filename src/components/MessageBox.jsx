import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useRef, useState } from "react";
import { useChat } from "../context/chatContext";
import OutsideClickHandler from "react-outside-click-handler";
//ICONS
import { IoIosSend } from "react-icons/io";
import { MdEmojiEmotions } from "react-icons/md";

function MessageBox() {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const { sendMessage } = useChat();
  const picker = useRef(null);
  const sendMessageToFriend = () => {
    if (messageValue) {
      sendMessage(messageValue);
      setMessageValue("");
    }
  };

  return (
    <div className="relative bg-white flex items-center h-[60px] rounded-br-xl sm:rounded-bl-none rounded-bl-xl">
      <textarea
        placeholder="Type something..."
        rows={10}
        value={messageValue}
        className="h-full w-[70%] sm:w-[80%] px-2 bg-transparent outline-none resize-none"
        onChange={(e) => setMessageValue(e.target.value)}
      ></textarea>
      <div className="space-x-2 pe-3 ms-auto flex items-end">
        <OutsideClickHandler onOutsideClick={() => setIsEmojiPickerOpen(false)}>
          <button
            type="button"
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            title="Emojis"
          >
            <MdEmojiEmotions size={25} color="gray" />
          </button>
           {/* EMOJI PICKER*/}
          {isEmojiPickerOpen && (
            <div ref={picker} className="absolute right-14 bottom-[100%]">
              <Picker
                data={data}
                perLine={7}
                onEmojiSelect={(e) => {
                  setMessageValue((prev) => `${prev} ${e.native} `);
                  setIsEmojiPickerOpen(false);
                }}
              />
            </div>
          )}
        </OutsideClickHandler>
        <button
          onClick={sendMessageToFriend}
          type="button"
          className="bg-indigo-400 hover:bg-indigo-600 rounded-md p-1"
          title="Send"
        >
          <IoIosSend size={30} color="white" />
        </button>
      </div>
    </div>
  );
}

export default MessageBox;
