import { useContext, createContext } from "react";
import { useChatSource } from "../hooks/useChatSource";

const ChatContext = createContext(null);

export function useChat() {
  if (!ChatContext) {
    throw new Error("the useChat should be used within ChatProvider");
  }
  return useContext(ChatContext);
}

export const ChatProvider = ({ children }) => {
  return (
    <ChatContext.Provider value={useChatSource()}>
      {children}
    </ChatContext.Provider>
  );
};
