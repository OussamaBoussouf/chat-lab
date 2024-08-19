import { memo, useEffect, useState } from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { IoIosPersonAdd } from "react-icons/io";
import { IoChatbubblesSharp } from "react-icons/io5";
import { useAuth } from "../context/authContext";
import OutsideClickHandler from "react-outside-click-handler";
import { auth, db } from "../fireStore";
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const usersRef = collection(db, "users");

function HeaderBar({ handleToggle }) {
  const { user, logOut } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  useEffect(() => {
    const queryAllUser = query(usersRef, where("uid", "!=", user.uid));
    const unsub = onSnapshot(queryAllUser, (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setAllUsers(users);
    });

    return () => unsub();
  }, []);

  const filteredUsers = allUsers.filter((user) =>
    user.displayName.includes(search.toLowerCase())
  );

  //ADD NEW USER TO MY LIST OF FRIENDS
  const addFriendToList = async (friend) => {
    try {
      await updateDoc(doc(db, "userChats", friend.uid), {
        [user.uid]: {
          uid: auth.currentUser.uid,
          displayName: auth.currentUser.displayName,
          photoURL: auth.currentUser.photoURL,
          date: serverTimestamp(),
        },
      });

      await updateDoc(doc(db, "userChats", user.uid), {
        [friend.uid]: {
          uid: friend.uid,
          displayName: friend.displayName,
          photoURL: friend.photoURL,
          date: serverTimestamp(),
        },
      });

      //CREATE A CHAT ROOM
      const combinedId =
        user.uid > friend.uid ? user.uid + friend.uid : friend.uid + user.uid;
      await setDoc(doc(db, "rooms", combinedId), {
        messages: [],
      });
      setSearch("");
      setIsDrawerOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  //LIST OF FRIENDS I HAVE
  const friendList = friends.map((user) => user.uid);

  return (
    <>
      {/* CHAT HEADING */}
      <div className="bg-light-blue relative h-[60px] rounded-tl-xl sm:rounded-tl-none rounded-tr-xl flex items-center justify-between sm:justify-end px-3">
        <button type="button" className="sm:hidden bg-transparent">
          <GoKebabHorizontal onClick={handleToggle} size={30} color="white" />
        </button>
        <div className="flex items-center gap-4">
          <OutsideClickHandler
            onOutsideClick={() => {
              setIsDrawerOpen(false);
            }}
          >
            <button
              type="button"
              className="bg-transparent"
              onClick={() => setIsDrawerOpen((prev) => !prev)}
            >
              {isDrawerOpen ? (
                <IoChatbubblesSharp
                  size={30}
                  color="white"
                  title="Back to chat"
                />
              ) : (
                <IoIosPersonAdd size={30} color="white" title="Add friend" />
              )}
            </button>
            {/* SEARCH FRIEND INPUT */}
            {isDrawerOpen && (
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
                      <div key={friend.uid} className="flex items-center">
                        <div>
                          <img
                            width={45}
                            height={45}
                            className="w-[45px] h-[45px] rounded-full"
                            src={friend.photoURL}
                            alt="profil image"
                          />
                        </div>
                        <div className="flex flex-col ms-2">
                          <p className="font-bold">{friend.displayName}</p>
                        </div>
                        <button
                          type="button"
                          className={`ms-auto btn btn-sm ${
                            friendList.includes(friend.uid)
                              ? "pointer-events-none"
                              : "btn-primary"
                          }`}
                          onClick={() => addFriendToList(friend)}
                        >
                          {friendList.includes(friend.uid)
                            ? "Already friend"
                            : "Add"}
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
