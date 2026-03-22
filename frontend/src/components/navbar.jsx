import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 md:px-10 py-4">
        
        {/* Logo */}
        <h1 className="text-2xl font-bold text-blue-600">
          PlyWorld
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 font-medium items-center">
          <a href="#home" className="hover:text-blue-600">Home</a>
          <a href="#gallery" className="hover:text-blue-600">Gallery</a>
          <a href="#about" className="hover:text-blue-600">About</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>

          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
        </div>

        {/* Hamburger Icon (Mobile) */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 pb-4 font-medium">
          <a href="#home" onClick={() => setIsOpen(false)}>Home</a>
          <a href="#gallery" onClick={() => setIsOpen(false)}>Gallery</a>
          <a href="#about" onClick={() => setIsOpen(false)}>About</a>
          <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>

          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
