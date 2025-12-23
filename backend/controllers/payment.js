import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/payment.js";
import User from "../models/user.js";

export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const amount = plan === "pro" ? 900 : 2900; 

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    const payment = await Payment.create({
      razorpay_order_id: order.id,
      plan,
      amount,
      currency: "INR",
    });

    res.json({
      success: true,
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      const payment = await Payment.findOneAndUpdate(
        { razorpay_order_id },
        {
          razorpay_payment_id,
          razorpay_signature,
          status: "paid",
        },
        { new: true }
      );

      await User.findByIdAndUpdate(userId, {
        subscriptionPlan: payment.plan,
      });

      res.json({ success: true,  plan: payment.plan , payment });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
