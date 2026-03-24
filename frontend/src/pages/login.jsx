import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Logo from "../assets/logo.png";
import LeftBg from "../assets/living.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-teal-600 relative overflow-hidden px-4 md:px-0">
      
      {/* Cloud shapes */}
      <div className="absolute top-0 left-0 w-48 h-48 md:w-72 md:h-72 bg-white rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-20 left-36 w-72 h-72 md:w-96 md:h-96 bg-white rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 md:w-80 md:h-80 bg-white rounded-full opacity-25 animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-48 h-48 md:w-60 md:h-60 bg-white rounded-full opacity-15 animate-pulse"></div>

      {/* Main container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl flex flex-col md:flex-row overflow-hidden relative z-10 h-auto md:h-[650px]">

        {/* Left side */}
        <div
          className="md:w-1/2 w-full relative flex items-center justify-center p-6 md:p-10 text-white min-h-[250px]"
          style={{
            backgroundImage: `url(${LeftBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
          <div className="relative z-10 text-center flex flex-col items-center px-4 md:px-0">
            <img src={Logo} alt="Logo" className="w-32 md:w-42 mb-4 md:mb-6" />
            <h1 className="text-2xl md:text-4xl font-serif font-extrabold mb-2 md:mb-4">
              Welcome to Wonder Plywood
            </h1>
            <p className="text-sm md:text-lg text-white/90 max-w-xs md:max-w-[250px]">
              Strong, stylish, and long-lasting plywood for furniture and interiors.
            </p>
          </div>
        </div>

        {/* Right side - login form */}
        <div className="md:w-1/2 w-full bg-white p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-8 text-center">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 md:p-4 rounded-xl border border-gray-300 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 md:p-4 rounded-xl border border-gray-300 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold transition-all hover:scale-105"
            >
              Login
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}