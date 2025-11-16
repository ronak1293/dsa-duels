import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useContext(AuthContext);

  if (loading) return null; // hide navbar until auth resolved

  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link to="/" style={{ marginRight: "20px" }}>Home</Link>

      {!user && (
        <>
          <Link to="/login" style={{ marginRight: "20px" }}>Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}

      {user && (
  <>
    <Link to="/find-match" style={{ marginRight: "20px" }}>Find Match</Link>
    <Link to="/user" style={{ marginRight: "20px" }}>Profile</Link>
    <button onClick={logout}>Logout</button>
  </>
)}
    </nav>
  );
}

