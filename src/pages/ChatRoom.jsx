import { useAuth } from "../context/authContext";


function ChatRoom() {

    const {logOut} = useAuth();

    return (
        <div>
            <h1>Welcome to Chatlab</h1>
            <button type="button" className="btn btn-primary" onClick={logOut}>Logout</button>
        </div>
    );
}

export default ChatRoom;