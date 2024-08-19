import { createContext, useContext, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db, storage } from "../fireStore";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  if (!AuthContext) {
    throw new Error("the useAuth should be used within AuthProvider");
  }

  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const signInUser = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userInfo = {
        uid: signInUser.user.uid,
        displayName: signInUser.user.displayName,
      };

      localStorage.setItem("user", JSON.stringify(userInfo));
      setUser(userInfo);
      setLoading(false);
      navigate("/chat-room");
    } catch (err) {
      setLoading(false);
      if (err instanceof FirebaseError) {
        if (err.code === "auth/invalid-credential") {
          return Promise.reject("Invalid credential or password is inncorrect");
        }
      }
    }
  };

  const signUp = async (username, email, password, avatar) => {
    setLoading(true);
    try {
      const createUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const storageRef = ref(storage, `profil-images/${new Date().getTime()}`);
      const snapshot = await uploadBytes(storageRef, avatar);
      const downloadURL = await getDownloadURL(snapshot.ref);
      await updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: downloadURL,
      });

      const userInfo = {
        uid: createUser.user.uid,
        displayName: createUser.user.displayName,
      };

      await setDoc(doc(db, "users", userInfo.uid), {
        uid: userInfo.uid,
        displayName: username,
        photoURL: auth.currentUser.photoURL,
      });

      await setDoc(doc(db, "userChats", userInfo.uid), {});

      localStorage.setItem("user", JSON.stringify(userInfo));
      setUser(userInfo);
      setLoading(false);
      navigate("/chat-room");
    } catch (err) {
      setLoading(false);
      if (err instanceof FirebaseError) {
        if (err.code === "auth/email-already-in-use") {
          return Promise.reject("This email is already in use");
        }
      }
      console.log(err);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      setUser(undefined);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
