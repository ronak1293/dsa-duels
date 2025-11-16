import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);   // ✅ added
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);          // ✅ insert token into context
    if (storedUser) setUser(JSON.parse(storedUser)); // restore user

    if (!storedToken) {
      setLoading(false);
      return;
    }

    api
      .get("/user/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(token);      // ✅ save token in context
    setUser(userData);    // same as before
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);   // ✅ clear token also
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading }}  // ✅ expose token
    >
      {children}
    </AuthContext.Provider>
  );
}
