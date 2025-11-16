import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <nav className="w-full backdrop-blur-md bg-white/60 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Left — Branding */}
        <Link
          to="/"
          className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          DSA Duel
        </Link>

        {/* Right — Links */}
        <div className="flex items-center gap-6 text-gray-700 font-medium">

          {!user && (
            <>
              <Link
                to="/login"
                className="hover:text-indigo-600 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hover:text-indigo-600 transition"
              >
                Signup
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                to="/find-match"
                className="hover:text-indigo-600 transition"
              >
                Find Match
              </Link>

              <Link
                to="/user"
                className="hover:text-indigo-600 transition"
              >
                Profile
              </Link>

              <button
                onClick={logout}
                className="px-3 py-1.5 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
