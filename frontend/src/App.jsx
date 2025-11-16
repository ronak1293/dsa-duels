import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FindMatch from "./pages/FindMatch";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/find-match"
          element={
            <ProtectedRoute>
              <FindMatch />
            </ProtectedRoute>
          }
        />
        <Route
  path="/user"
  element={
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  }
/>
      </Routes>
    </>
  );
}
