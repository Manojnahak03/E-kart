import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Session } from "../models/sessionModel.js";
import { sendOTPEmail } from "../Email_Verify/sendOTPMail.js";


// ==========================================
// SAFE USER
// ==========================================

const safeUser = (user) => {
  const obj = user.toObject
    ? user.toObject()
    : { ...user };

  delete obj.password;
  delete obj.otp;
  delete obj.otpExpiry;
  delete obj.token;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpiry;

  return obj;
};


// ==========================================
// GENERATE OTP
// ==========================================

const generateOTP = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};


// ==========================================
// REGISTER
// ==========================================

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    let user = await User.findOne({
      email: normalizedEmail,
    });

    // Existing unverified user
    if (user && !user.isVerified) {
      const otp = generateOTP();

      user.firstName = firstName;
      user.lastName = lastName;
      user.password = await bcrypt.hash(
        password,
        10
      );

      user.otp = otp;

      user.otpExpiry =
        new Date(Date.now() + 10 * 60 * 1000);

      await user.save();

      await sendOTPEmail(
        otp,
        normalizedEmail,
        "registration"
      );

      return res.status(200).json({
        success: true,
        message:
          "OTP sent to your email. Please verify your account.",
        email: normalizedEmail,
      });
    }

    // Existing verified user
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const otp = generateOTP();

    user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,

      isVerified: false,

      otp,

      otpExpiry:
        new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOTPEmail(
      otp,
      normalizedEmail,
      "registration"
    );

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. OTP sent to your email.",
      email: normalizedEmail,
    });

  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ==========================================
// VERIFY REGISTRATION OTP
// ==========================================

export const verify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified",
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }

    if (new Date(user.otpExpiry) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    if (String(otp) !== String(user.otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Email verified successfully. You can now login.",
      user: safeUser(user),
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ==========================================
// RESEND REGISTRATION OTP
// ==========================================

export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified",
      });
    }

    const otp = generateOTP();

    user.otp = otp;

    user.otpExpiry =
      new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await sendOTPEmail(
      otp,
      normalizedEmail,
      "registration"
    );

    return res.status(200).json({
      success: true,
      message: "New OTP sent successfully",
    });

  } catch (error) {
    console.error("Resend OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ==========================================
// LOGIN
// ==========================================

export const login = async (req, res) => {
  try {
    const {
      email,
      password,
      loginAs = "user",
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        existingUser.password
      );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!["user", "admin"].includes(loginAs)) {
      return res.status(400).json({
        success: false,
        message: "Invalid login type",
      });
    }

    if (
      loginAs === "admin" &&
      existingUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This account is not an admin account",
      });
    }

    if (
      loginAs === "user" &&
      existingUser.role === "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Use Admin Login for this account",
      });
    }

    if (!existingUser.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email using OTP before login.",
      });
    }

    const accessToken = jwt.sign(
      {
        id: existingUser._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "10d",
      }
    );

    const refreshToken = jwt.sign(
      {
        id: existingUser._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );

    existingUser.isloggedIn = true;

    await existingUser.save();

    const existingSession =
      await Session.findOne({
        userId: existingUser._id,
      });

    if (existingSession) {
      await Session.deleteOne({
        userId: existingUser._id,
      });
    }

    await Session.create({
      userId: existingUser._id,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: safeUser(existingUser),
      accessToken,
      refreshToken,
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ==========================================
// LOGOUT
// ==========================================

export const logout = async (req, res) => {
  try {
    const userId =
      req.id ||
      req.user?._id ||
      req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized: User ID not found",
      });
    }

    await Session.deleteMany({
      userId,
    });

    await User.findByIdAndUpdate(
      userId,
      {
        isloggedIn: false,
      }
    );

    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};


// ==========================================
// FORGOT PASSWORD - SEND OTP
// ==========================================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    const otp = generateOTP();

    user.otp = otp;

    user.otpExpiry =
      new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await sendOTPEmail(
      otp,
      normalizedEmail,
      "forgot-password"
    );

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email",
      email: normalizedEmail,
    });

  } catch (error) {
    console.error(
      "Forgot Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ==========================================
// VERIFY FORGOT PASSWORD OTP
// ==========================================

export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    const email =
      req.params.email.toLowerCase().trim();

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    if (new Date(user.otpExpiry) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (String(otp) !== String(user.otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Generate temporary password reset token
    const resetToken = jwt.sign(
      {
        id: user._id,
        purpose: "password-reset",
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "10m",
      }
    );

    user.otp = null;
    user.otpExpiry = null;

    user.passwordResetToken = resetToken;

    user.passwordResetExpiry =
      new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken,
    });

  } catch (error) {
    console.error("Verify Reset OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ==========================================
// CHANGE PASSWORD AFTER OTP
// ==========================================

export const changePassword = async (req, res) => {
  try {
    const {
      resetToken,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !resetToken ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(
        resetToken,
        process.env.SECRET_KEY
      );
    } catch {
      return res.status(401).json({
        success: false,
        message:
          "Password reset session expired. Please try again.",
      });
    }

    if (decoded.purpose !== "password-reset") {
      return res.status(401).json({
        success: false,
        message: "Invalid password reset token",
      });
    }

    const user = await User.findById(
      decoded.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      user.passwordResetToken !== resetToken
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid password reset session",
      });
    }

    if (
      !user.passwordResetExpiry ||
      new Date(user.passwordResetExpiry) <
        new Date()
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Password reset session has expired",
      });
    }

    user.password =
      await bcrypt.hash(newPassword, 10);

    user.passwordResetToken = null;
    user.passwordResetExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully. Please login.",
    });

  } catch (error) {
    console.error(
      "Change Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ==========================================
// ALL USERS
// ==========================================

export const allUsers = async (_, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -otpExpiry -token -passwordResetToken -passwordResetExpiry");

    return res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      users,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ==========================================
// GET USER
// ==========================================

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select(
        "-password -otp -otpExpiry -token -passwordResetToken -passwordResetExpiry"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ==========================================
// UPDATE PROFILE
// ==========================================

export const updateProfile = async (req, res) => {
  try {
    const allowed = (({
      firstName,
      lastName,
      email,
      phoneNo,
      address,
      city,
      zipCode,
      profilePic,
    }) => ({
      firstName,
      lastName,
      email,
      phoneNo,
      address,
      city,
      zipCode,
      profilePic,
    }))(req.body);

    if (allowed.email) {
      const exists = await User.findOne({
        email: allowed.email,
        _id: {
          $ne: req.id,
        },
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }

      allowed.email =
        allowed.email.toLowerCase().trim();
    }

    const user =
      await User.findByIdAndUpdate(
        req.id,
        allowed,
        {
          new: true,
          runValidators: true,
        }
      ).select(
        "-password -otp -otpExpiry -token -passwordResetToken -passwordResetExpiry"
      );

    res.json({
      success: true,
      message: "Profile updated",
      user,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};