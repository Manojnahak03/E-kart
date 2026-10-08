import express from "express";

import {
  register,
  verify,
  reVerify,
  login,
  logout,
  forgotPassword,
  verifyOTP,
  changePassword,
  allUsers,
  getUserById,
  updateProfile,
} from "../controller/userController.js";

import {
  isAuthenticated,
  isAdmin,
} from "../middleware/isAuthenticated.js";

const router = express.Router();

// Registration
router.post("/register", register);
router.post("/verify", verify);
router.post("/reVerify", reVerify);

// Login
router.post("/login", login);
router.post(
  "/logout",
  isAuthenticated,
  logout
);

// Forgot Password
router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/verify-otp/:email",
  verifyOTP
);

router.put(
  "/change-password",
  changePassword
);

// Admin
router.get(
  "/all-users",
  isAuthenticated,
  isAdmin,
  allUsers
);

// Profile
router.put(
  "/profile",
  isAuthenticated,
  updateProfile
);

router.get(
  "/get-user/:userId",
  getUserById
);

export default router;