import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "chat-app-5a631.firebaseapp.com",
  projectId: "chat-app-5a631",
  storageBucket: "chat-app-5a631.appspot.com",
  messagingSenderId: "531230801231",
  appId: "1:531230801231:web:868d31a7368986a53fd93a"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage();