import Picker from "@emoji-mart/react";
import { useRef, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
//ICONS
import { IoIosSend } from "react-icons/io";
import { MdEmojiEmotions } from "react-icons/md";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../context/authContext";
import { db } from "../fireStore";
import { useChat } from "../context/chatContext";
import { Data } from "emoji-mart";

function MessageBox() {
  const { user } = useAuth();
  const { data } = useChat();
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const picker = useRef(null);
  const sendMessageToFriend = async () => {
    if (!messageValue) return;
    try {
      await updateDoc(doc(db, "rooms", data.roomId), {
        messages: arrayUnion({
          msg: messageValue,
          name: user.displayName,
          createdAt: Timestamp.now(),
        }),
      });

      await updateDoc(
        doc(db, "userChats", user.uid),
        {
          [data.friend.uid + ".lastMessage"]: messageValue,
          [data.friend.uid + ".date"]: serverTimestamp(),
        },
        { merge: true }
      );

      await updateDoc(
        doc(db, "userChats", data.friend.uid),
        {
          [user.uid + ".lastMessage"]: messageValue,
          [user.uid + ".date"]: serverTimestamp(),
        },
        { merge: true }
      );

      setMessageValue("");
    } catch (err) {
      console.log(err);
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
                data={Data}
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
