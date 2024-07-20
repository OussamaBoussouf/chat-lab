import { useContext, createContext, useReducer } from "react";

const ChatContext = createContext(null);

export function useChat() {
  if (!ChatContext) {
    throw new Error("the useChat should be used within ChatProvider");
  }
  return useContext(ChatContext);
}

export const ChatProvider = ({ children }) => {
  const INITIAL_STATE = {
    roomId: null,
    friend: {}
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_ROOM":
        return { ...state, roomId: action.payload.combinedId, friend: action.payload.friendInfo };
      default:
        return state;
    }
  };

  const [state , dispatch] = useReducer(chatReducer , INITIAL_STATE);

  return (
    <ChatContext.Provider value={{data:state, dispatch}}>
      {children}
    </ChatContext.Provider>
  );
};
