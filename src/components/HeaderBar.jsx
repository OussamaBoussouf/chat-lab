import { useState } from "react";
import { GoKebabHorizontal } from "react-icons/go";
import { IoIosPersonAdd } from "react-icons/io";
import { IoChatbubblesSharp } from "react-icons/io5";
import {useAuth} from "../context/authContext";
import profilImage from "../assets/img/profil-image.jpg";

const friends = ["Sam", "John", "Steven", "Carlose", "Sandy"];

function HeaderBar({ handleToggle }) {
  const { logOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [listOfUsers, setListOfUsers] = useState([]);
  const handleFilter = (value) => {
    setSearch(value);
    if (value === "") {
      setListOfUsers([]);
      return;
    }
    setListOfUsers(
      friends.filter((ele) =>
        ele.toLocaleLowerCase().includes(value.toLocaleLowerCase())
      )
    );
  };
  return (
    <>
      {/* CHAT HEADING */}
      <div className="bg-light-blue h-[60px] rounded-tl-xl sm:rounded-tl-none rounded-tr-xl flex items-center justify-between sm:justify-end px-3">
        <button type="button" className="sm:hidden">
          <GoKebabHorizontal onClick={handleToggle} size={30} color="white" />
        </button>
        <div className="flex items-center gap-4">
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
          <button onClick={logOut} type="button" title="Menu" className="btn btn-primary btn-sm">
            Log out
          </button>
        </div>
      </div>
      {/* SEARCH FRIEND INPUT */}
      {isSidebarOpen && (
        <div className="p-2 overflow-auto absolute top-[60px] rounded-br-xl rounded-bl-xl sm:rounded-bl-none z-10 h-[calc(100%-60px)] w-full bg-slate-300">
          <input
            type="search"
            placeholder="Find friends..."
            className="w-full h-10 py-1 px-2 rounded-md"
            onChange={(e) => handleFilter(e.target.value)}
          />
          <div className="py-5 space-y-4">
            {listOfUsers.length === 0 && search && (
              <p className="font-bold">Sorry no match found</p>
            )}
            {listOfUsers.map((friend, index) => (
              <div key={index} className="flex items-center">
                <div>
                  <img
                    width={45}
                    height={45}
                    className="w-[45px] h-[45px] rounded-full"
                    src={profilImage}
                    alt="profil image"
                  />
                </div>
                <div className="flex flex-col ms-2">
                  <p className="font-bold">{friend}</p>
                </div>
                <button
                  type="button"
                  className="ms-auto btn btn-sm btn-primary"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default HeaderBar;
