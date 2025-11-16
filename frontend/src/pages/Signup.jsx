import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    handle: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.post("/auth/signup", form);
    login(res.data.token, res.data.user);
    nav("/find-match");
  };

  return (
    <form onSubmit={submit}>
      <input
        type="email"
        placeholder="email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="text"
        placeholder="Codeforces Handle"
        onChange={(e) => setForm({ ...form, handle: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button>Signup</button>
    </form>
  );
}
