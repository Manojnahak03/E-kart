import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";

const Verify = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const email = localStorage.getItem("verifyEmail");

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found. Please signup again.");
      navigate("/signup");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/user/verify", {
        email,
        otp,
      });

      if (res.data.success) {
        toast.success("Account verified successfully!");

        localStorage.removeItem("verifyEmail");

        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };


  const resendOTP = async () => {
    if (!email) {
      toast.error("Email not found");
      return;
    }

    try {
      setResending(true);

      const res = await api.post("/user/reVerify", {
        email,
      });

      if (res.data.success) {
        toast.success("New OTP sent to your email");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend OTP"
      );
    } finally {
      setResending(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <MailCheck className="w-7 h-7 text-blue-600" />
            </div>
          </div>


          {/* Heading */}
          <div className="text-center mb-7">

            <h1 className="text-2xl font-bold text-gray-900">
              Verify Your Email
            </h1>

            <p className="text-gray-500 mt-2">
              Enter the 6-digit OTP sent to
            </p>

            <p className="font-semibold text-blue-600 mt-1 break-all">
              {email}
            </p>

          </div>


          <form onSubmit={handleVerify}>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification OTP
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              placeholder="Enter 6-digit OTP"
              className="w-full text-center text-2xl tracking-[8px] px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />


            <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

          </form>


          {/* Resend */}
          <div className="text-center mt-6">

            <p className="text-sm text-gray-500 mb-2">
              Didn't receive the OTP?
            </p>

            <button
              onClick={resendOTP}
              disabled={resending}
              className="text-blue-600 font-semibold hover:underline disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>

          </div>


          {/* Login */}
          <div className="text-center mt-5 text-sm text-gray-600">

            Already verified?{" "}

            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Verify;