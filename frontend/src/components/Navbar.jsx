import React, { useState } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  LogOut,
  UserRound,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { toast } from "sonner";
import api from "../lib/api";
import logo from "../assets/ManojMart.png";

export default function Navbar() {
  const { user } = useSelector((state) => state.user);

  const count = useSelector((state) =>
    state.cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    )
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  // ================= LOGOUT =================
  const logout = async () => {
    try {
      await api.post("/user/logout");
    } catch (error) {
      // Even if backend logout fails, clear local session
    }

    localStorage.removeItem("accessToken");
    dispatch(setUser(null));

    toast.success("Logged out successfully");
    setOpen(false);
    navigate("/");
  };

  // ================= CLOSE MENU =================
  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200">

      {/* ================= NAVBAR CONTAINER ================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">

        {/* ================= LOGO ================= */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-white flex items-center justify-center">
            <img
              src={logo}
              alt="ManojMart"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* ================= DESKTOP / MOBILE NAVIGATION ================= */}
        <nav
          className={`
            ${open ? "flex" : "hidden"}
            md:flex
            absolute
            md:static
            top-14
            left-0
            right-0
            md:items-center
            bg-white
            md:bg-transparent
            border-b
            md:border-0
            px-5
            py-4
            md:p-0
            flex-col
            md:flex-row
            gap-5
            shadow-lg
            md:shadow-none
          `}
        >
          {/* Home */}
          <Link
            onClick={closeMenu}
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
            to="/"
          >
            Home
          </Link>

          {/* Products */}
          <Link
            onClick={closeMenu}
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
            to="/products"
          >
            Products
          </Link>

          {/* Dashboard */}
          <Link
            onClick={closeMenu}
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
            to="/dashboard"
          >
            Dashboard
          </Link>

          {/* Profile */}
          {user && (
            <Link
              onClick={closeMenu}
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
              to="/profile"
            >
              Profile
            </Link>
          )}

          {/* Admin */}
          {user?.role === "admin" && (
            <Link
              onClick={closeMenu}
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
              to="/admin"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-2">

          {/* ================= CART ================= */}
          <Link
            to="/cart"
            onClick={closeMenu}
            className="relative w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-slate-50 transition"
          >
            <ShoppingCart className="w-4 h-4" />

            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {/* ================= USER / LOGIN ================= */}

          {user ? (
            <>
              {/* Profile Button */}
              <Link
                to="/profile"
                onClick={closeMenu}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-slate-100 text-xs sm:text-sm font-semibold hover:bg-slate-200 transition"
              >
                <UserRound className="w-4 h-4" />

                <span className="hidden sm:inline">
                  {user.firstName}
                </span>
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="w-9 h-9 rounded-lg bg-slate-950 text-white flex items-center justify-center hover:bg-slate-800 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* ================= LOGIN BUTTON ================= */
            <Link
              to="/login"
              onClick={closeMenu}
              className="bg-slate-950 text-white px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold hover:bg-slate-800 transition whitespace-nowrap"
            >
              Login
            </Link>
          )}

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-slate-50 transition"
            aria-label="Toggle menu"
          >
            {open ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>

        </div>
      </div>
    </header>
  );
}