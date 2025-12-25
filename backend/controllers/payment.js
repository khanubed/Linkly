import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/payment.js";
import User from "../models/user.js";

/* ================= CREATE ORDER ================= */
export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({ success: false, message: "Plan required" });
    }

    const amount = plan === "pro" ? 900 : 2900; // paise

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    await Payment.create({
      razorpay_order_id: order.id,
      plan,
      amount,
      currency: "INR",
      status: "created",
    });

    res.json({
      success: true,
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

/* ================= VERIFY PAYMENT ================= */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = req.body;

    // console.log("Verify body:", req.body);


    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    //  Update payment
    const payment = await Payment.findOneAndUpdate(
      { razorpay_order_id },
      {
        razorpay_payment_id,
        razorpay_signature,
        status: "paid",
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    // ✅Update user subscription
    await User.findByIdAndUpdate(userId, {
      subscriptionPlan: payment.plan,
      subscriptionStatus: "active",
    });

    res.json({
      success: true,
      plan: payment.plan,
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

