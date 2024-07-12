import profilImage from "../assets/img/profil-image.jpg";
import avatar from "../assets/img/avatar-profil.png";
import { useChat } from "../context/chatContext";
import { useAuth } from "../context/authContext";
import { useMemo, useState } from "react";

function Sidebar({ onSelect, selectedFriend, handleToggle, isOpen }) {
  const { friends, changeChatRoom } = useChat();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const filteredFriends = useMemo(() => {
    return friends.filter((friend) => friend.username.includes(search));
  }, [friends, search]);

  const handleClick = (friendId) => {
    onSelect(true);
    changeChatRoom(friendId);
  };

  return (
    <>
      {/*DESKTOP*/}
      <div className="hidden sm:block h-[500px] w-[300px]">
        {/* TOP LEFT HEADER */}
        <div className="bg-dark-navy rounded-tl-xl flex items-center justify-between p-2 w-full h-[60px]">
          <p className="hidden sm:block font-bold text-white">
            Chat<span className="text-blue-500">lab</span>
          </p>
          <div className="flex items-center">
            <img
              width={40}
              height={40}
              className="me-2 w-[40px] h-[40px] rounded-full"
              src={avatar}
              alt="profil image"
            />
            <p className="text-white">{user.userName}</p>
          </div>
        </div>
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
                key={friend.id}
                onClick={() => handleClick(friend.id)}
                className={`flex items-center ${
                  friend.id === selectedFriend && "bg-slate-500"
                } hover:bg-slate-500 cursor-pointer p-2`}
              >
                <div className="relative">
                  <img
                    width={60}
                    height={60}
                    className="w-[60px] h-[60px] rounded-full"
                    src={friend.profileImage ?? profilImage}
                    alt="profil image"
                  />
                  <span
                    className={`absolute bottom-0 right-0 ${
                      friend.isConnected ? "bg-green-400" : "bg-gray-400"
                    } border-[3px] border-light-navy w-4 h-4 block rounded-full`}
                  ></span>
                </div>
                <div className="flex flex-col ms-4">
                  <p className="font-bold text-white text-lg">
                    {friend.username}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/*MOBILE*/}
      {isOpen && (
        <div className="sm:hidden fixed z-20 left-0 h-[500px] w-[300px]">
          {/* TOP LEFT HEADER */}
          <div className="bg-dark-navy rounded-tl-xl flex items-center justify-between p-2 w-full h-[60px]">
            <p className="hidden sm:block font-bold text-white">
              Chat<span className="text-blue-500">lab</span>
            </p>
            <div className="flex items-center w-full">
              <img
                width={40}
                height={40}
                className="me-2 w-[40px] h-[40px] rounded-full"
                src={profilImage}
                alt="profil image"
              />
              <p className="text-white">{user.userName}</p>
              <button
                type="button"
                className="btn btn-sm ms-auto"
                onClick={handleToggle}
              >
                Close
              </button>
            </div>
          </div>
          {/* FRIEND LIST */}
          <div className="h-[440px] bg-light-navy rounded-bl-xl">
            <input
              type="text"
              placeholder="Find a user"
              className="w-full p-2 h-[40px] outline-none text-white bg-transparent border-b-[1px]"
            />
            <div className="h-[calc(100%-40px)] overflow-y-auto">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className={`flex items-center ${
                    selectedFriend == friend.id && "bg-slate-500 "
                  } hover:bg-slate-500 cursor-pointer p-2`}
                >
                  <div className="relative">
                    <img
                      width={60}
                      height={60}
                      className="w-[60px] h-[60px] rounded-full"
                      src={friend.profileImage ?? profilImage}
                      alt="profil image"
                    />
                    <span
                      className={`absolute bottom-0 right-0 ${
                        friend.isConnected ? "bg-green-400" : "bg-gray-400"
                      } border-[3px] border-light-navy w-4 h-4 block rounded-full`}
                    ></span>
                  </div>
                  <div className="flex flex-col ms-4">
                    <p className="font-bold text-white text-lg">
                      {friend.username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
