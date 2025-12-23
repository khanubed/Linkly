import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,
  plan: {
    type: String,
    enum: ["pro", "business"],
    required: true,
  },
  amount: Number,
  currency: String,
  status: {
    type: String,
    default: "created",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Payment", paymentSchema);