import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

import { toast } from "sonner";
import api from "../lib/api";

import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

export default function Login() {
  const [adminMode, setAdminMode] =
    useState(false);

  const [show, setShow] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const nav = useNavigate();
  const dispatch = useDispatch();

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.post(
        "/user/login",
        {
          ...form,
          loginAs: adminMode
            ? "admin"
            : "user",
        }
      );

      dispatch(
        setUser(res.data.user)
      );

      localStorage.setItem(
        "accessToken",
        res.data.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        res.data.refreshToken
      );

      toast.success(
        adminMode
          ? "Admin login successful"
          : "Login successful"
      );

      nav(
        adminMode
          ? "/admin"
          : "/"
      );

    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white border rounded-3xl shadow-xl p-7">

        <div className="text-center mb-7">

          <div
            className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center ${
              adminMode
                ? "bg-slate-950 text-white"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            <ShieldCheck />
          </div>

          <h1 className="text-2xl font-black mt-4">
            {adminMode
              ? "Admin Login"
              : "Welcome back"}
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            {adminMode
              ? "Authorized administrators only"
              : "Login to continue to ManojMart"}
          </p>

        </div>

        <form
          onSubmit={submit}
          className="space-y-4"
        >

          <div>
            <label className="text-sm font-semibold">
              Email
            </label>

            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="mt-2 w-full h-11 rounded-xl border px-3"
              placeholder="you@example.com"
            />
          </div>

          <div>

            <label className="text-sm font-semibold">
              Password
            </label>

            <div className="relative mt-2">

              <input
                required
                type={
                  show
                    ? "text"
                    : "password"
                }
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password:
                      e.target.value,
                  })
                }
                className="w-full h-11 rounded-xl border px-3 pr-11"
                placeholder="Enter password"
              />

              <button
                type="button"
                onClick={() =>
                  setShow(!show)
                }
                className="absolute right-3 top-3"
              >
                {show ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
          </div>

          {!adminMode && (
            <div className="text-right">

              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>

            </div>
          )}

          <button
            disabled={loading}
            className="w-full h-11 rounded-xl bg-slate-950 text-white font-bold disabled:opacity-50"
          >
            {loading
              ? "Signing in..."
              : adminMode
              ? "Login as Admin"
              : "Login"}
          </button>

        </form>

        <button
          type="button"
          onClick={() =>
            setAdminMode(!adminMode)
          }
          className="w-full mt-4 text-sm font-semibold text-blue-600"
        >
          {adminMode
            ? "← User Login"
            : "Login as Admin"}
        </button>

        {!adminMode && (
          <p className="text-center text-sm text-slate-600 mt-4">
            New user?{" "}

            <Link
              to="/signup"
              className="font-bold text-blue-600"
            >
              Create account
            </Link>
          </p>
        )}

      </div>
    </div>
  );
}