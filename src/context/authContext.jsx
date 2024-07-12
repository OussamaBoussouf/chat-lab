import { createContext, useContext, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../fireStore";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

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
        userId: signInUser.user.uid,
        userName: signInUser.user.displayName,
      };

      //UPDATE THE STATE OF CONNECTION
      const userDoc = doc(db, "users", userInfo.userId);
      await updateDoc(userDoc, {
        isConnected: true,
      });

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

  const signUp = async (username, email, password) => {
    setLoading(true);
    try {
      const createUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(auth.currentUser, {
        displayName: username,
      })
        .then(() => console.log("Profile Updated"))
        .catch((err) => console.log(err));

      const userInfo = {
        userId: createUser.user.uid,
        userName: createUser.user.displayName,
      };

      await setDoc(doc(db, "users", userInfo.userId), {
        id: userInfo.userId,
        username: username,
        profileImage: null,
        isConnected: true,
        friends: [],
      });
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
      const connectedUserDoc = doc(db, "users", user.userId);
      await updateDoc(connectedUserDoc, {
        isConnected: false,
      });
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
