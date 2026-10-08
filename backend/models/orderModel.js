import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  image: String,
  price: Number,
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [orderItemSchema], required: true },
  shippingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    zipCode: String,
    phone: String,
  },
  amount: { type: Number, required: true },
  payment: {
    method: { type: String, enum: ["razorpay", "cod", "demo_upi", "demo_qr", "demo_card"], default: "razorpay" },
    status: { type: String, enum: ["pending", "paid", "failed", "cod"], default: "pending" },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
  },
  status: {
    type: String,
    enum: ["Placed", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Placed",
  },
  statusHistory: [{ status: String, note: String, at: { type: Date, default: Date.now } }],
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
