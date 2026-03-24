import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Logo from "../assets/logo.png";
import LeftBg from "../assets/living.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Eye icons

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // toggle state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("token/", { username, password });
      localStorage.setItem("access", res.data.access);
      navigate("/customers");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-600 relative overflow-hidden">
      
      {/* Cloud shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-20 left-40 w-96 h-96 bg-white rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full opacity-25 animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-60 h-60 bg-white rounded-full opacity-15 animate-pulse"></div>

      {/* Main container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[650px] flex overflow-hidden relative z-10">

        {/* Left side */}
        <div
          className="w-1/2 relative flex items-center justify-center p-10 text-white"
          style={{
            backgroundImage: `url(${LeftBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
          <div className="relative z-10 text-center flex flex-col items-center">
            <img src={Logo} alt="Logo" className="w-42 mb-6" />
            <h1 className="text-4xl font-serif font-extrabold mb-4">Welcome to Wonder Plywood</h1>
            <p className="text-lg text-white/90 max-w-xs">
              Strong, stylish, and long-lasting plywood for furniture and interiors.
            </p>
          </div>
        </div>

        {/* Right side - login form */}
        <div className="w-1/2 bg-white p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />

            {/* Password input with show/hide */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105"
            >
              Login
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}