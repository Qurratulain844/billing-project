import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  HiMenu,
  HiX,
  HiChevronLeft,
  HiChevronRight,
  HiHome,
  HiUsers,
  HiCube,
  HiDocumentText,
  HiCog,
  HiLogout,
} from "react-icons/hi";
import logo from "../assets/logo.png";
import smallLogo from "../assets/wonderw.svg"; // new small logo

export default function Layout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
      isActive
        ? "bg-teal-600 text-white shadow-[0_0_20px_rgba(20,184,166,0.6)]"
        : "text-gray-300 hover:bg-teal-700/60 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full h-[95vh] bg-white rounded-3xl shadow-2xl flex overflow-hidden">

        {/* SIDEBAR */}
        <aside
          className={`bg-[#0e2f2f] text-white transition-all duration-500 ease-in-out relative ${
            collapsed ? "w-20" : "w-72"
          } hidden lg:flex flex-col`}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-10 bg-teal-600 p-1 rounded-full shadow-lg hover:scale-110 transition"
          >
            {collapsed ? <HiChevronRight /> : <HiChevronLeft />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 p-6 transition-all duration-300">
            <img
              src={collapsed ? smallLogo : logo}
              alt="Logo"
              className={`transition-all duration-100 ${
                collapsed ? "h-25 w-25" : "h-20 w-auto"
              }`}
            />
            
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 px-3 mt-4 text-sm flex-1">
            <NavLink to="/" className={navClass}>
              <HiHome size={20} />
              {!collapsed && "Home"}
            </NavLink>
            <NavLink to="/customers" className={navClass}>
              <HiUsers size={20} />
              {!collapsed && "Customers"}
            </NavLink>
            <NavLink to="/products" className={navClass}>
              <HiCube size={20} />
              {!collapsed && "Products"}
            </NavLink>
            <NavLink to="/create-invoice" className={navClass}>
              <HiDocumentText size={20} />
              {!collapsed && "Create Invoice"}
            </NavLink>
            <NavLink to="/invoices" className={navClass}>
              <HiDocumentText size={20} />
              {!collapsed && "Invoices"}
            </NavLink>
            <NavLink to="/settings" className={navClass}>
              <HiCog size={20} />
              {!collapsed && "Settings"}
            </NavLink>
          </nav>

          {/* Logout */}
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              <HiLogout size={20} />
              {!collapsed && "Logout"}
            </button>
          </div>
        </aside>

        {/* MOBILE SIDEBAR */}
        <div
          className={`fixed inset-0 z-40 lg:hidden ${mobileOpen ? "block" : "hidden"}`}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          ></div>

          <aside className="absolute left-0 top-0 h-full w-72 bg-[#0e2f2f] p-6 shadow-xl transition-transform duration-500">
            <button
              className="text-white mb-6"
              onClick={() => setMobileOpen(false)}
            >
              <HiX size={24} />
            </button>
            <img src={logo} alt="Logo" className="h-10 mb-6" />
          </aside>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col bg-gray-50">
          <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm lg:hidden">
            <button onClick={() => setMobileOpen(true)}>
              <HiMenu size={24} />
            </button>
            <img src={logo} alt="Logo" className="h-8" />
          </header>

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-md p-6 min-h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}