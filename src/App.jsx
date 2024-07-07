import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ChatRoom from "./pages/ChatRoom";
import { useAuth } from "./context/authContext";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/chat-room" /> : <SignIn />} />
        <Route path="/sign-up" element={user ? <Navigate to="/chat-room" /> : <SignUp />} />
        <Route
          path="/chat-room"
          element={user ? <ChatRoom /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;
