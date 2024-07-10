import { useState } from "react";
import profilImage from "../assets/img/profil-image.jpg";
import avatar from "../assets/img/avatar-profil.png";

const friends = ["Sam", "John", "Steven", "Carlose", "Sandy"];

function Sidebar({ handleToggle, isOpen }) {
  const [selectedFriend, setSelectedFriend] = useState(null);

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
            <p className="text-white">Othman</p>
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
            {friends.map((friend, index) => (
              <div
                key={index}
                onClick={() => setSelectedFriend(index)}
                className={`flex items-center ${
                  selectedFriend == index && "bg-slate-500 "
                } hover:bg-slate-500 cursor-pointer p-2`}
              >
                <div className="relative">
                  <img
                    width={60}
                    height={60}
                    className="w-[60px] h-[60px] rounded-full"
                    src={profilImage}
                    alt="profil image"
                  />
                  <span className="absolute bottom-0 right-0 bg-green-400 border-[3px] border-light-navy w-4 h-4 block rounded-full"></span>
                </div>
                <div className="flex flex-col ms-4">
                  <p className="font-bold text-white text-lg">{friend}</p>
                  {/* <p className="text-white">I'm waiting.</p> */}
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
              <p className="text-white">Othman</p>
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
              {friends.map((friend, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedFriend(index)}
                  className={`flex items-center ${
                    selectedFriend == index && "bg-slate-500 "
                  } hover:bg-slate-500 cursor-pointer p-2`}
                >
                  <div className="relative">
                    <img
                      width={60}
                      height={60}
                      className="w-[60px] h-[60px] rounded-full"
                      src={profilImage}
                      alt="profil image"
                    />
                    <span className="absolute bottom-0 right-0 bg-green-400 w-3 h-3 block rounded-full"></span>
                  </div>
                  <div className="flex flex-col ms-4">
                    <p className="font-bold text-white text-lg">{friend}</p>
                    {/* <p className="text-white">I'm waiting.</p> */}
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
