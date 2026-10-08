import crypto from "crypto";
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";

const buildOrderItems = async (items) => {
  if (!items?.length) {
    throw new Error("Cart is empty");
  }

  const ids = items.map((item) => item.productId);

  const products = await Product.find({
    _id: { $in: ids },
  });

  const map = new Map(
    products.map((product) => [String(product._id), product])
  );

  let amount = 0;
  const normalized = [];

  for (const item of items) {
    const product = map.get(String(item.productId));
    const quantity = Math.max(1, Number(item.quantity || 1));

    if (!product) {
      throw new Error("One of the products no longer exists");
    }

    if (product.stock < quantity) {
      throw new Error(`${product.name} has insufficient stock`);
    }

    amount += product.price * quantity;

    normalized.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
    });
  }

  return { amount, normalized };
};

// ===============================
// RAZORPAY CREATE ORDER
// ===============================

export const createRazorpayOrder = async (req, res) => {
  try {
    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return res.status(503).json({
        success: false,
        message: "Razorpay keys are not configured",
      });
    }

    const { items, shippingAddress } = req.body;

    if (
      !items?.length ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.zipCode ||
      !shippingAddress?.phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Cart and complete shipping address are required",
      });
    }

    const { amount, normalized } = await buildOrderItems(items);

    const auth = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString("base64");

    const razorpayResponse = await fetch(
      "https://api.razorpay.com/v1/orders",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency: "INR",
          receipt: `MM_${Date.now()}`,
        }),
      }
    );

    const razorpayOrder = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      throw new Error(
        razorpayOrder.error?.description ||
          "Razorpay order creation failed"
      );
    }

    // Create pending order in MongoDB
    const order = await Order.create({
      user: req.id,
      items: normalized,
      shippingAddress,
      amount,

      payment: {
        method: "razorpay",
        status: "pending",
        razorpayOrderId: razorpayOrder.id,
      },

      status: "Placed",

      statusHistory: [
        {
          status: "Placed",
          note: "Razorpay payment initiated",
        },
      ],
    });

    res.status(201).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrder,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Razorpay Create Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// RAZORPAY VERIFY PAYMENT
// ===============================

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are missing",
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({
        success: false,
        message: "Razorpay secret key is not configured",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Prevent duplicate verification
    if (order.payment.status === "paid") {
      return res.json({
        success: true,
        message: "Payment already verified",
        order,
      });
    }

    // Make sure Razorpay order matches our MongoDB order
    if (order.payment.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order ID does not match",
      });
    }

    // Generate signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    // Payment successful
    order.payment.status = "paid";
    order.payment.razorpayPaymentId = razorpay_payment_id;
    order.payment.razorpaySignature = razorpay_signature;

    order.status = "Confirmed";

    order.statusHistory.push({
      status: "Confirmed",
      note: "Razorpay Test payment verified successfully",
    });

    await order.save();

    // Reduce stock only after successful payment
    await Promise.all(
      order.items.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: {
            stock: -item.quantity,
          },
        })
      )
    );

    res.json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error("Razorpay Verify Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// USER ORDERS
// ===============================

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// SINGLE ORDER
// ===============================

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// ADMIN - ALL ORDERS
// ===============================

export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// ADMIN - UPDATE ORDER STATUS
// ===============================

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    order.statusHistory.push({
      status,
      note: note || `Order marked ${status}`,
    });

    await order.save();

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};