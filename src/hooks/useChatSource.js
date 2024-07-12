import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  or,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useEffect, useReducer } from "react";
import { db } from "../fireStore";
import { useAuth } from "../context/authContext";
import { chatReducer } from "../reducer/chatReducer";

const usersRef = collection(db, "users");

export const useChatSource = () => {
  const { user } = useAuth();

  const [{ friends, chatRoomMessages, roomId }, dispatch] = useReducer(
    chatReducer,
    {
      friends: [],
      chatRoomMessages: [],
      roomId: "",
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myFriends = [];
        const docRef = doc(db, "users", `${user.userId}`);
        const docSnap = await getDoc(docRef);
        const listOfFriends = docSnap.data().friends;
        for (let i = 0; i < listOfFriends.length; i++) {
          const myQuery = query(
            usersRef,
            where("id", "==", listOfFriends[i])
          );
          const querySnapshot = await getDocs(myQuery);
          querySnapshot.forEach((doc) => {
            myFriends.push(doc.data());
          });
        }
        dispatch({
          type: "SET_FRIENDS",
          payload: myFriends,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, `rooms/${roomId ? roomId : null}/messages`),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      })
      dispatch({
        type: "SET_MESSAGES",
        payload: messages,
      });
    });
    return () => unsubscribe();
  }, [roomId]);

  const sendMessage = async (message) => {
    try {
      // CREATE MESSAGE TO BE SENT
      const messageCollection = collection(db, `rooms/${roomId}/messages`);
      await addDoc(messageCollection, {
        msg: message,
        name: user.userName,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const changeChatRoom = async (friendId) => {
    let roomId = "";
    //RETREIVE THE ROOM ID
    const roomCollection = collection(db, `rooms`);
    //GET
    const q = query(
      roomCollection,
      or(
        where("id", "==", `${user.userId}${friendId}`),
        where("id", "==", `${friendId}${user.userId}`)
      )
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      roomId = doc.id;
    });

    dispatch({
      type: "CHANGE_CHAT_ROOM",
      payload: roomId,
    });
  };

  const value = { friends, sendMessage, changeChatRoom, chatRoomMessages };

  return value;
};
