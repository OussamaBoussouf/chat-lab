import { memo } from "react";
import { auth} from "../fireStore";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../context/authContext";



function ProfileBar({ handleToggle, isClose }) {
  const { user } = useAuth();
  return (
    <div className="bg-dark-navy rounded-tl-xl flex items-center justify-between p-2 w-full h-[60px]">
      <p className="hidden sm:block font-bold text-white">
        Chat<span className="text-blue-500">lab</span>
      </p>
      <div className="flex items-center">
        <img
          width={45}
          height={45}
          
          className="me-2 w-[45px] h-[45px] rounded-full"
          src={auth.currentUser?.photoURL}
          alt="profil image"
        />
        <p className="text-white">{user.displayName}</p>
      </div>
      {isClose && (
        <button
          type="button"
          className="bg-white p-1 rounded-md"
          onClick={handleToggle}
        >
          <IoClose size={20} />
        </button>
      )}
    </div>
  );
}

export default memo(ProfileBar);
