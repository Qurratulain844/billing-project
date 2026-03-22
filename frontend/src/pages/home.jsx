import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiArrowRight,
  HiLocationMarker,
  HiPhone,
  HiMail,
} from "react-icons/hi";
import logo from "../assets/logo.png";

/* ===== IMAGES ===== */
const plywoodItems = [
  {
    name: "Classic Plywood",
    image:
      "https://wigwamply.com/wp-content/uploads/2026/03/Eco-Friendly-Plywoo.jpeg",
  },
  {
    name: "Premium Birch",
    image:
      "https://wigwamply.com/wp-content/uploads/2024/12/Finished-Birch-Plywood-Transforming-Raw-Material-into-Ready-to-Use-Designs.jpg",
  },
  {
    name: "Oak Finish",
    image:
      "https://centuryply.com/blogimage/appeal_2.jpeg",
  },
  {
    name: "Teak Boards",
    image:
      "https://www.centuryply.com/uploads/Adobe_Stock_1402032944_6081267136.png",
  },
  {
    name: "Marine Plywood",
    image:
      "https://www.greenply.com:5001/originalfile1773816556113-4361.jpg",
  },
  {
    name: "Laminated Sheets",
    image:
      "https://acemica.com/blogs/wp-content/uploads/2025/06/Best-Laminate-Sheet.webp",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-gray-900 to-black text-white">
      {/* ===== NAVBAR ===== */}
      <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
        <div className="flex justify-between items-center px-8 h-24 max-w-7xl mx-auto">

          {/* LOGO (BIG) */}
          <div className="flex items-center h-full">
            <img
              src={logo}
              alt="logo"
              className="h-full max-h-20 object-contain cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          {/* LINKS */}
          <div className="hidden md:flex gap-8 text-gray-300 font-medium items-center">
            <a href="#home" className="hover:text-teal-400">Home</a>
            <a href="#gallery" className="hover:text-teal-400">Gallery</a>
            <a href="#about" className="hover:text-teal-400">About</a>
            <a href="#contact" className="hover:text-teal-400">Contact</a>
          </div>

          {/* LOGIN / LOGOUT */}
          <div className="flex items-center">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 px-5 py-2 rounded-xl hover:scale-105 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-teal-500 px-6 py-2 rounded-xl hover:scale-105 transition"
              >
                Login
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* ===== HERO ===== */}
      <section
        id="home"
        className="max-w-7xl mx-auto px-8 py-28 grid md:grid-cols-2 gap-10 items-center"
      >
        <div>
          <h2 className="text-5xl font-bold leading-tight drop-shadow-lg">
            Premium Quality <br />
            <span className="text-teal-400">Plywood Solutions</span>
          </h2>

          <p className="mt-6 text-gray-300 text-lg">
            Strong, stylish, and long-lasting plywood for furniture and interiors.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="#gallery"
              className="flex items-center gap-2 bg-teal-500 px-6 py-3 rounded-xl hover:scale-105 transition"
            >
              View Collection <HiArrowRight />
            </a>

            <a
              href="#contact"
              className="px-6 py-3 border border-white/30 rounded-xl hover:bg-white/10 transition"
            >
              Contact Us
            </a>
            {isLoggedIn && (
              <button
                onClick={() => navigate("/customers")}
                className="px-6 py-3 bg-gray-800 border border-teal-400 text-teal-400 rounded-xl hover:bg-teal-500 hover:text-white transition"
              >
                ← Back to Customers
              </button>
            )}
          </div>
        </div>

        {/* HERO IMAGE */}
        <img
          src="https://blog.buyerselect.com/wp-content/uploads/2021/01/home-office-ideas-3.jpg"
          alt="plywood"
          className="rounded-3xl shadow-2xl border border-white/10"
        />
      </section>

      {/* ===== GALLERY ===== */}
      <section id="gallery" className="max-w-7xl mx-auto px-8 py-20">
        <h3 className="text-4xl font-bold text-center mb-16">
          Our Collection
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {plywoodItems.map((item, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-2xl border border-white/10 hover:scale-105 transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-60 object-cover group-hover:scale-110 duration-500"
              />

              <div className="bg-black/60 p-4 text-center">
                <h4 className="text-lg font-semibold">{item.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section
        id="about"
        className="max-w-7xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-16 items-center"
      >
        <img
          src="https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=900"
          alt="about"
          className="rounded-3xl shadow-2xl border border-white/10"
        />

        <div>
          <h3 className="text-4xl font-bold mb-6">
            About <span className="text-teal-400">Wonder Plywood</span>
          </h3>

          <p className="text-gray-300 mb-6">
            We provide high-quality plywood for furniture, interiors, and construction.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-10">
            <div className="bg-white/5 p-6 rounded-2xl text-center">
              <h4 className="text-3xl text-teal-400">30+</h4>
              <p>Years Experience</p>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl text-center">
              <h4 className="text-3xl text-teal-400">50K+</h4>
              <p>Happy Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="max-w-7xl mx-auto px-8 py-20">
        <h3 className="text-4xl font-bold text-center mb-16">
          Contact Us
        </h3>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/5 p-8 rounded-2xl">
            <HiLocationMarker size={40} className="mx-auto text-teal-400 mb-4" />
            <p>Industrial Area, Aurangabad, India</p>
          </div>

          <div className="bg-white/5 p-8 rounded-2xl">
            <HiPhone size={40} className="mx-auto text-teal-400 mb-4" />
            <p>+91 98765 43210</p>
          </div>

          <div className="bg-white/5 p-8 rounded-2xl">
            <HiMail size={40} className="mx-auto text-teal-400 mb-4" />
            <p>info@wonderplywood.com</p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="text-center py-10 border-t border-white/10 text-gray-400">
        © 2026 Wonder Plywood. All rights reserved.
      </footer>
    </div>
  );
}