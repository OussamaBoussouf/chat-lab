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
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useReducer } from "react";
import { db } from "../fireStore";
import { useAuth } from "../context/authContext";
import { chatReducer } from "../reducer/chatReducer";

const usersRef = collection(db, "users");

export const useChatSource = () => {
  const { user } = useAuth();

  const [{ friends, chatRoomMessages, roomId, users }, dispatch] = useReducer(
    chatReducer,
    {
      friends: [],
      chatRoomMessages: [],
      roomId: "",
      users: [],
    }
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "users", `${user.userId}`),
      async (doc) => {
        const myFriends = [];
        const listOfFriends = doc.data().friends;
        for (let i = 0; i < listOfFriends.length; i++) {
          const myQuery = query(usersRef, where("id", "==", listOfFriends[i]));
          const querySnapshot = await getDocs(myQuery);
          querySnapshot.forEach((doc) => {
            myFriends.push(doc.data());
          });
        }
        dispatch({
          type: "SET_FRIENDS",
          payload: myFriends,
        });
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = [];
        const myQuery = query(usersRef, where("id", "!=", user.userId));
        const usersDocs = await getDocs(myQuery);
        usersDocs.forEach((doc) => {
          users.push(doc.data());
        });

        dispatch({
          type: "SET_USERS",
          payload: users,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
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
      });
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

  const createRoom = async (userId, friendId) => {
    try {
      await setDoc(doc(db, "rooms", `${userId}${friendId}`), {
        id: `${userId}${friendId}`,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const addFriend = async (friendId) => {
    try {
      const userDocRef = doc(db, "users", user.userId);
      const userDoc = (await getDoc(userDocRef)).data();
      const userFriends = userDoc.friends;
      userFriends.push(friendId);
      await updateDoc(userDocRef, {
        friends: userFriends,
      });

      const addedUserDocRef = doc(db, "users", friendId);
      const addedUserDoc = (await getDoc(addedUserDocRef)).data();
      const addedUserFriends = addedUserDoc.friends;
      addedUserFriends.push(user.userId);
      await updateDoc(addedUserDocRef, {
        friends: addedUserFriends,
      });

      createRoom(user.userId, friendId);
    } catch (err) {
      console.log(err);
    }
  };

  const value = {
    friends,
    sendMessage,
    changeChatRoom,
    chatRoomMessages,
    users,
    addFriend,
  };

  return value;
};
