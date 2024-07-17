import { useEffect, useRef, useState } from "react";
import avatar from "../assets/img/avatar-profil.png";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../fireStore";
import { updateProfile } from "firebase/auth";

function ProfilBar({ user }) {
  const inputFile = useRef(null);
  const [profilImage, setProfilImage] = useState("");

  const uploadImage = (file) => {
    const storageRef = ref(storage, `profil-images/${new Date().getTime()}`);
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          updateDoc(doc(db, "users", user.userId), {
            profileImage: downloadURL,
          });
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).catch((err) => console.error(err));
        });
      })
      .catch((err) => console.error("Something went wrong: " + err));
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", `${user.userId}`), (doc) => {
    const newProfilImage = doc.data().profileImage;
      setProfilImage(newProfilImage);
    })

    return () => unsubscribe();

  }, []);



  return (
    <div className="bg-dark-navy rounded-tl-xl flex items-center justify-between p-2 w-full h-[60px]">
      <p className="hidden sm:block font-bold text-white">
        Chat<span className="text-blue-500">lab</span>
      </p>
      <div className="flex items-center">
        <img
          width={45}
          height={45}
          title="Upload profil image"
          className="cursor-pointer me-2 w-[45px] h-[45px] rounded-full"
          onClick={() => inputFile.current.click()}
          src={
            profilImage
              ? profilImage
              : avatar
          }
          alt="profil image"
        />
        <input
          onChange={(e) => {
            uploadImage(e.target.files[0]);
          }}
          ref={inputFile}
          className="h-0 w-0 overflow-hidden opacity-0"
          type="file"
        />
        <p className="text-white">{user.userName}</p>
      </div>
    </div>
  );
}

export default ProfilBar;
