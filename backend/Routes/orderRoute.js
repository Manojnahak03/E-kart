import express from "express";

import {
  createRazorpayOrder,
  verifyPayment,
  getMyOrders,
  getOrder,
  allOrders,
  updateOrderStatus,
} from "../controller/orderController.js";

import {
  isAuthenticated,
  isAdmin,
} from "../middleware/isAuthenticated.js";

const router = express.Router();

// Razorpay Test Mode
router.post(
  "/razorpay/create",
  isAuthenticated,
  createRazorpayOrder
);

router.post(
  "/razorpay/verify",
  isAuthenticated,
  verifyPayment
);

// User Orders
router.get(
  "/my",
  isAuthenticated,
  getMyOrders
);

router.get(
  "/:id",
  isAuthenticated,
  getOrder
);

// Admin Orders
router.get(
  "/admin/all",
  isAuthenticated,
  isAdmin,
  allOrders
);

router.patch(
  "/:id/status",
  isAuthenticated,
  isAdmin,
  updateOrderStatus
);

export default router;