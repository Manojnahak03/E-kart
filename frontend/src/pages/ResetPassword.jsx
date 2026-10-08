import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  useEffect(() => {
    const savedEmail =
      localStorage.getItem(
        "resetEmail"
      );

    if (!savedEmail) {
      navigate("/forgot-password");
      return;
    }

    setEmail(savedEmail);
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error(
        "Enter valid 6 digit OTP"
      );
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      toast.error(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      // Step 1: Verify OTP
      const verifyRes =
        await api.post(
          `/user/verify-otp/${encodeURIComponent(
            email
          )}`,
          {
            otp,
          }
        );

      if (!verifyRes.data.success) {
        throw new Error(
          "OTP verification failed"
        );
      }

      const resetToken =
        verifyRes.data.resetToken;

      // Step 2: Change password
      const passwordRes =
        await api.put(
          "/user/change-password",
          {
            resetToken,
            newPassword,
            confirmPassword,
          }
        );

      if (passwordRes.data.success) {
        localStorage.removeItem(
          "resetEmail"
        );

        toast.success(
          "Password changed successfully"
        );

        navigate("/login");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setResending(true);

      const res = await api.post(
        "/user/forgot-password",
        {
          email,
        }
      );

      toast.success(
        res.data.message
      );

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to resend OTP"
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white border rounded-3xl shadow-xl p-7">

        <div className="text-center">

          <div className="text-4xl">
            🔑
          </div>

          <h1 className="text-2xl font-black mt-4">
            Reset Password
          </h1>

          <p className="text-slate-500 text-sm mt-2">
            Enter the OTP sent to:
          </p>

          <p className="font-semibold text-sm mt-1">
            {email}
          </p>

        </div>

        <form
          onSubmit={submit}
          className="mt-6 space-y-4"
        >

          {/* OTP */}

          <div>
            <label className="text-sm font-semibold">
              OTP
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              className="mt-2 w-full h-12 rounded-xl border px-3 text-center text-xl tracking-[8px] font-bold"
              placeholder="000000"
            />
          </div>

          {/* NEW PASSWORD */}

          <div>
            <label className="text-sm font-semibold">
              New Password
            </label>

            <div className="relative mt-2">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                required
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                className="w-full h-11 rounded-xl border px-3 pr-11"
                placeholder="New password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-3"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
          </div>

          {/* CONFIRM PASSWORD */}

          <div>
            <label className="text-sm font-semibold">
              Confirm Password
            </label>

            <div className="relative mt-2">

              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                required
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="w-full h-11 rounded-xl border px-3 pr-11"
                placeholder="Confirm password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(
                    !showConfirm
                  )
                }
                className="absolute right-3 top-3"
              >
                {showConfirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
          </div>

          <button
            disabled={loading}
            className="w-full h-11 rounded-xl bg-slate-950 text-white font-bold disabled:opacity-50"
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </form>

        <button
          onClick={resendOTP}
          disabled={resending}
          className="w-full mt-4 text-sm font-semibold text-blue-600"
        >
          {resending
            ? "Sending..."
            : "Resend OTP"}
        </button>

      </div>
    </div>
  );
}