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

  const logout = async () => {
    try {
      await api.post("/user/logout");
    } catch (error) {}

    localStorage.removeItem("accessToken");
    dispatch(setUser(null));

    toast.success("Logged out");
    navigate("/");
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200">

      {/* Smaller Navbar */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* ================= LOGO ================= */}

        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center shrink-0"
        >
          {/* Rectangle image cropped inside circle */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-white flex items-center justify-center">
            <img
              src={logo}
              alt="ManojMart"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>


        {/* ================= NAVIGATION ================= */}

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

          <Link
            onClick={closeMenu}
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
            to="/"
          >
            Home
          </Link>

          <Link
            onClick={closeMenu}
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
            to="/products"
          >
            Products
          </Link>

          <Link
            onClick={closeMenu}
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
            to="/dashboard"
          >
            Dashboard
          </Link>

          {user && (
            <Link
              onClick={closeMenu}
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
              to="/profile"
            >
              Profile
            </Link>
          )}

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


          {/* Cart */}

          <Link
            to="/cart"
            className="relative w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-slate-50 transition"
          >
            <ShoppingCart className="w-4 h-4" />

            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>


          {/* Logged In */}

          {user ? (
            <>

              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-sm font-semibold hover:bg-slate-200 transition"
              >
                <UserRound className="w-4 h-4" />

                <span>
                  {user.firstName}
                </span>
              </Link>


              <button
                onClick={logout}
                className="hidden sm:flex w-9 h-9 rounded-lg bg-slate-950 text-white items-center justify-center hover:bg-slate-800 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>

            </>

          ) : (

            <Link
              to="/login"
              className="hidden sm:block bg-slate-950 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition"
            >
              Login
            </Link>

          )}


          {/* Mobile */}

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-slate-50 transition"
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