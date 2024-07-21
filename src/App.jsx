import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import SignIn from "./pages/SignIn";
const ChatRoom = lazy(() => import("./pages/ChatRoom"));
const SignUp = lazy(() => import("./pages/SignUp"));
import { useAuth } from "./context/authContext";
import Loading from "./components/Loading";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/chat-room" /> : <SignIn />}
        />
        <Route
          path="/sign-up"
          element={
            user ? (
              <Navigate to="/chat-room" />
            ) : (
              <Suspense fallback={<Loading/>}>
                <SignUp />
              </Suspense>
            )
          }
        />
        <Route
          path="/chat-room"
          element={user ? <ChatRoom /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;
