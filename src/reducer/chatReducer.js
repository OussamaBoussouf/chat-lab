export const chatReducer = (state, action) => {
  switch (action.type) {
    case "SET_MESSAGES":
      return { ...state, chatRoomMessages: action.payload };
    case "CHANGE_CHAT_ROOM":
      return { ...state, roomId: action.payload };
    case "SET_FRIENDS":
      return { ...state, friends: action.payload };
    case "SET_USERS":
      return { ...state, users: action.payload }; 
    default:
      return 'Unsupported Request'
  }
};
