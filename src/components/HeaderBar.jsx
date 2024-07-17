import { memo, useState } from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { IoIosPersonAdd } from "react-icons/io";
import { IoChatbubblesSharp } from "react-icons/io5";
import { useAuth } from "../context/authContext";
import { useChat } from "../context/chatContext";
import avatar from "../assets/img/avatar-profil.png";
import OutsideClickHandler from "react-outside-click-handler";

function HeaderBar({ handleToggle }) {
  const { logOut } = useAuth();
  const { users, addFriend, friends } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    user.username.includes(search.toLowerCase())
  );

  const friendList = friends.map((friend) => friend.id);

  const onClick = (friendId) => {
    addFriend(friendId);
  };


  return (
    <>
      {/* CHAT HEADING */}
      <div className="bg-light-blue relative h-[60px] rounded-tl-xl sm:rounded-tl-none rounded-tr-xl flex items-center justify-between sm:justify-end px-3">
        <button type="button" className="sm:hidden">
          <GoKebabHorizontal onClick={handleToggle} size={30} color="white" />
        </button>
        <div className="flex items-center gap-4">
          <OutsideClickHandler
            onOutsideClick={() => {
              setIsSidebarOpen(false);
            }}
          >
            <button
              type="button"
              title="Add friend"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
              {isSidebarOpen ? (
                <IoChatbubblesSharp size={30} color="white" />
              ) : (
                <IoIosPersonAdd size={30} color="white" />
              )}
            </button>
             {/* SEARCH FRIEND INPUT */}
            {isSidebarOpen && (
              <div className="p-2 overflow-auto absolute left-0 top-[60px] rounded-br-xl rounded-bl-xl sm:rounded-bl-none z-10 h-[440px] w-full bg-slate-300">
                <input
                  type="search"
                  placeholder="Find friends..."
                  className="w-full h-10 py-1 px-2 rounded-md"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="py-5 space-y-4">
                  {filteredUsers.length === 0 && search && (
                    <p className="font-bold">Sorry no match found</p>
                  )}
                  {search &&
                    filteredUsers.map((friend) => (
                      <div key={friend.id} className="flex items-center">
                        <div>
                          <img
                            width={45}
                            height={45}
                            className="w-[45px] h-[45px] rounded-full"
                            src={
                              friend.profileImage
                                ? friend.profileImage
                                : avatar
                            }
                            alt="profil image"
                          />
                        </div>
                        <div className="flex flex-col ms-2">
                          <p className="font-bold">{friend.username}</p>
                        </div>
                        <button
                          type="button"
                          className="ms-auto btn btn-sm btn-primary"
                          disabled={friendList.includes(friend.id)}
                          onClick={() => onClick(friend.id)}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </OutsideClickHandler>
          <button
            onClick={logOut}
            type="button"
            title="Menu"
            className="btn btn-primary btn-sm"
          >
            Log out
          </button>
        </div>
      </div>
    </>
  );
}

export default memo(HeaderBar);
