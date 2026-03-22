import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("token/", {
        username,
        password,
      });

      localStorage.setItem("access", res.data.access);

      navigate("/customers");   // 🔥 redirect here

    } catch {
      alert("Invalid credentials");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 to-gray-900">

      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">

        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-teal-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-teal-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl transition-all hover:scale-105"
          >
            Login
          </button>
          
        </form>

      </div>

    </div>
  );
}