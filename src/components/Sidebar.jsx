import { useAuth } from "../context/authContext";
import { useEffect, useMemo, useState } from "react";
import ProfileBar from "./ProfileBar";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../fireStore";
import { useChat } from "../context/chatContext";
import OutsideClickHandler from "react-outside-click-handler";

function Sidebar({ handleToggle, isOpen }) {
  const [friends, setFriends] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { dispatch } = useChat();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "userChats", `${user.uid}`),
      async (doc) => {
        const myFriends = [];
        for (const key in doc.data()) {
          myFriends.push(doc.data()[key]);
        }
        setFriends(myFriends);
      }
    );
    return () => unsub();
  }, []);

  const filteredFriends = useMemo(() => {
    return friends
      .filter((friend) => friend.displayName.includes(search.toLowerCase()))
      .sort((a, b) => b.date?.seconds - a.date?.seconds);
  }, [friends, search]);

  const handleSelect = (friend) => {
    const combinedId =
      user.uid > friend.uid ? user.uid + friend.uid : friend.uid + user.uid;
    const friendInfo = {
      photoURL: friend.photoURL,
      uid: friend.uid,
    };
    if (isOpen) handleToggle();
    dispatch({
      type: "CHANGE_ROOM",
      payload: {
        combinedId,
        friendInfo,
      },
    });
    setSelectedUser(friend.uid);
  };


  return (
    <>
      {/*DESKTOP*/}
      <div className="hidden sm:block h-[500px] w-[300px]">
        {/* TOP LEFT HEADER */}
        <ProfileBar />
        {/* FRIEND LIST */}
        <div className="h-[440px] bg-light-navy rounded-bl-xl">
          <input
            type="text"
            placeholder="Find a user"
            className="w-full p-2 h-[40px] outline-none text-white bg-transparent border-b-[1px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="h-[calc(100%-40px)] overflow-y-auto">
            {filteredFriends?.map((friend) => (
              <div
                key={friend.uid}
                onClick={() => {
                  handleSelect(friend);
                }}
                className={`flex items-center ${
                  selectedUser === friend.uid ? "bg-slate-500 " : ""
                } hover:bg-slate-500 cursor-pointer p-2`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    width={55}
                    height={55}
                    className="w-[55px] h-[55px] rounded-full"
                    src={friend.photoURL}
                    alt="profil image"
                  />
                </div>
                <div className="flex flex-col ms-4">
                  <p className="font-bold text-white text-lg">
                    {friend.displayName}
                  </p>
                  <p className=" text-white">
                    {friend?.lastMessage && friend?.lastMessage?.length < 20
                      ? friend?.lastMessage
                      : friend?.lastMessage && friend?.lastMessage?.length >= 20
                      ? friend?.lastMessage?.substring(0, 22) + "..."
                      : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/*MOBILE*/}
      <OutsideClickHandler
        onOutsideClick={() => {
          if (isOpen) handleToggle();
        }}
      >
        {isOpen && (
          <div
            className={`sm:hidden left-0 top-1/2 -translate-y-1/2 absolute z-10 h-[500px] w-[70%]`}
          >
            {/* TOP LEFT HEADER */}
            <ProfileBar isClose={true} handleToggle={handleToggle} />
            {/* FRIEND LIST */}
            <div className="h-[440px] bg-light-navy rounded-bl-xl">
              <input
                type="text"
                placeholder="Find a user"
                className="w-full p-2 h-[40px] outline-none text-white bg-transparent border-b-[1px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="h-[calc(100%-40px)] overflow-y-auto">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.uid}
                    onClick={() => {
                      handleSelect(friend);
                    }}
                    className={`flex items-center ${
                      selectedUser === friend.uid ? "bg-slate-500 " : ""
                    } hover:bg-slate-500 cursor-pointer p-2`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        width={55}
                        height={55}
                        className="w-[45px] h-[45px] sm:w-[55px] sm:h-[55px] rounded-full"
                        src={friend.photoURL}
                        alt="profil image"
                      />
                    </div>
                    <div className="flex flex-col ms-4">
                      <p className="font-bold text-white  sm:text-lg">
                        {friend.displayName}
                      </p>
                      <p className=" text-white">
                        {friend?.lastMessage && friend?.lastMessage?.length < 20
                          ? friend?.lastMessage
                          : friend?.lastMessage &&
                            friend?.lastMessage?.length >= 20
                          ? friend?.lastMessage?.substring(0, 22) + "..."
                          : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </OutsideClickHandler>
    </>
  );
}

export default Sidebar;
