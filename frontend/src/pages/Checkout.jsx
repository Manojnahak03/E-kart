import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  CreditCard,
} from "lucide-react";

import { clearCart } from "../redux/cartSlice";
import api from "../lib/api";
import { toast } from "sonner";

export default function Checkout() {
  const items = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // =========================
  // DELIVERY FORM
  // =========================

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
  });

  // =========================
  // TOTAL
  // =========================

  const total = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        Number(item.price) * Number(item.quantity || 1),
      0
    );
  }, [items]);

  // =========================
  // FORM CHANGE
  // =========================

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // RAZORPAY PAYMENT
  // =========================

  const pay = async () => {
    // Cart check
    if (!items.length) {
      toast.error("Your cart is empty");
      return;
    }

    // Address validation
    if (
      !form.firstName ||
      !form.lastName ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.zipCode
    ) {
      toast.error("Please complete delivery details");
      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // STEP 1: CREATE RAZORPAY ORDER
      // ==========================================

      const res = await api.post(
        "/orders/razorpay/create",
        {
          items: items.map((item) => ({
            productId: item._id,
            quantity: item.quantity || 1,
          })),

          shippingAddress: {
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            address: form.address,
            city: form.city,
            zipCode: form.zipCode,
          },
        }
      );

      // Backend response
      const razorpayOrder = res.data.razorpayOrder;
      const razorpayKey = res.data.key;
      const orderId = res.data.orderId;

      // Check response
      if (
        !razorpayOrder?.id ||
        !razorpayKey ||
        !orderId
      ) {
        throw new Error(
          "Razorpay order creation failed"
        );
      }

      // ==========================================
      // STEP 2: CHECK RAZORPAY SCRIPT
      // ==========================================

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout not loaded. Please refresh the page."
        );
      }

      // ==========================================
      // STEP 3: RAZORPAY OPTIONS
      // ==========================================

      const options = {
        key: razorpayKey,

        amount: razorpayOrder.amount,

        currency: "INR",

        name: "ManojMart",

        description: "ManojMart College Project",

        order_id: razorpayOrder.id,

        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: user?.email || "",
          contact: form.phone,
        },

        notes: {
          project: "ManojMart College Project",
        },

        theme: {
          color: "#2563eb",
        },

        // ========================================
        // PAYMENT SUCCESS
        // ========================================

        handler: async function (payment) {
          try {
            // ====================================
            // STEP 4: VERIFY PAYMENT
            // ====================================

            await api.post(
              "/orders/razorpay/verify",
              {
                razorpay_order_id:
                  payment.razorpay_order_id,

                razorpay_payment_id:
                  payment.razorpay_payment_id,

                razorpay_signature:
                  payment.razorpay_signature,

                orderId: orderId,
              }
            );

            // Clear cart
            dispatch(clearCart());

            toast.success(
              "Payment successful! Order confirmed."
            );

            // Go to orders
            navigate("/profile?tab=orders");
          } catch (error) {
            console.error(
              "Payment Verification Error:",
              error
            );

            toast.error(
              error?.response?.data?.message ||
                "Payment verification failed"
            );
          } finally {
            setLoading(false);
          }
        },

        // ========================================
        // PAYMENT WINDOW CLOSED
        // ========================================

        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.info("Payment cancelled");
          },
        },
      };

      // ==========================================
      // STEP 5: OPEN RAZORPAY
      // ==========================================

      const razorpay = new window.Razorpay(options);

      // Payment failed event
      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay Payment Failed:",
            response
          );

          toast.error(
            response?.error?.description ||
              "Payment failed"
          );

          setLoading(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Razorpay Payment Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Unable to start payment"
      );

      setLoading(false);
    }
  };

  // =========================
  // LOGIN CHECK
  // =========================

  if (!user) {
    return (
      <div className="pt-32 text-center">
        Please login to checkout.
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4">

        {/* HEADER */}

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-bold">
            <ShieldCheck size={14} />
            RAZORPAY TEST MODE
          </div>

          <h1 className="text-4xl font-black mt-3">
            Checkout
          </h1>

          <p className="text-slate-500 mt-1">
            Secure demo payment using Razorpay Test
            Mode. No real money is charged.
          </p>
        </div>

        {/* MAIN GRID */}

        <div className="grid lg:grid-cols-[1fr_350px] gap-6">

          {/* LEFT SIDE */}

          <div className="space-y-6">

            {/* DELIVERY DETAILS */}

            <section className="bg-white border rounded-3xl p-6 shadow-sm">

              <h2 className="text-lg font-bold">
                Delivery Details
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mt-5">

                {/* FIRST NAME */}

                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={change}
                  placeholder="First name"
                  className="h-11 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* LAST NAME */}

                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={change}
                  placeholder="Last name"
                  className="h-11 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* PHONE */}

                <input
                  name="phone"
                  value={form.phone}
                  onChange={change}
                  placeholder="Phone"
                  type="tel"
                  className="h-11 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* CITY */}

                <input
                  name="city"
                  value={form.city}
                  onChange={change}
                  placeholder="City"
                  className="h-11 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* ZIP */}

                <input
                  name="zipCode"
                  value={form.zipCode}
                  onChange={change}
                  placeholder="ZIP code"
                  className="h-11 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* ADDRESS */}

                <input
                  name="address"
                  value={form.address}
                  onChange={change}
                  placeholder="Full address"
                  className="sm:col-span-2 h-11 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>
            </section>

            {/* PAYMENT INFO */}

            <section className="bg-white border rounded-3xl p-6 shadow-sm">

              <h2 className="text-lg font-bold">
                Payment
              </h2>

              <div className="mt-5 rounded-2xl bg-blue-50 border border-blue-100 p-5">

                <div className="flex items-center gap-3">

                  <div className="bg-blue-600 text-white p-3 rounded-xl">
                    <CreditCard size={24} />
                  </div>

                  <div>
                    <div className="font-bold">
                      Razorpay Test Checkout
                    </div>

                    <div className="text-sm text-slate-500">
                      UPI • Cards • Net Banking
                    </div>
                  </div>

                </div>

                <p className="text-xs text-slate-500 mt-4">
                  This is Razorpay Test Mode. No real
                  money will be deducted.
                </p>

              </div>
            </section>
          </div>

          {/* RIGHT SIDE */}

          <aside className="bg-slate-950 text-white rounded-3xl p-6 h-fit lg:sticky lg:top-24">

            <p className="text-slate-400 text-sm">
              Order Total
            </p>

            <div className="text-3xl font-black mt-2">
              ₹{total.toLocaleString("en-IN")}
            </div>

            {/* ITEMS */}

            <div className="mt-5 space-y-3 text-sm">

              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between gap-3"
                >
                  <span className="text-slate-300">
                    {item.name} × {item.quantity}
                  </span>

                  <span>
                    ₹
                    {(
                      Number(item.price) *
                      Number(item.quantity || 1)
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}

            </div>

            {/* PAY BUTTON */}

            <div className="border-t border-slate-700 mt-5 pt-5">

              <button
                disabled={loading}
                onClick={pay}
                className="w-full rounded-xl bg-white text-slate-950 py-3 font-black disabled:opacity-50"
              >
                {loading
                  ? "Opening Razorpay..."
                  : `Pay ₹${total.toLocaleString(
                      "en-IN"
                    )}`}
              </button>

              <p className="text-[11px] text-slate-400 text-center mt-3">
                🔒 Razorpay Test Mode • ₹0 real money
              </p>

            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}