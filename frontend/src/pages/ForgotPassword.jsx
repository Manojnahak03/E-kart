import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { toast } from "sonner";
import api from "../lib/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/user/forgot-password",
        {
          email,
        }
      );

      if (res.data.success) {
        localStorage.setItem(
          "resetEmail",
          email
        );

        toast.success(
          res.data.message
        );

        navigate(
          "/reset-password"
        );
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white border rounded-3xl shadow-xl p-7">

        <div className="text-center">

          <div className="text-4xl">
            🔐
          </div>

          <h1 className="text-2xl font-black mt-4">
            Forgot Password?
          </h1>

          <p className="text-slate-500 text-sm mt-2">
            Enter your registered email and
            we'll send you an OTP.
          </p>

        </div>

        <form
          onSubmit={submit}
          className="mt-6 space-y-4"
        >

          <div>
            <label className="text-sm font-semibold">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="mt-2 w-full h-11 rounded-xl border px-3"
              placeholder="you@example.com"
            />
          </div>

          <button
            disabled={loading}
            className="w-full h-11 rounded-xl bg-slate-950 text-white font-bold disabled:opacity-50"
          >
            {loading
              ? "Sending OTP..."
              : "Send OTP"}
          </button>

        </form>

        <div className="text-center mt-5">

          <Link
            to="/login"
            className="text-sm font-semibold text-blue-600"
          >
            ← Back to Login
          </Link>

        </div>

      </div>
    </div>
  );
}