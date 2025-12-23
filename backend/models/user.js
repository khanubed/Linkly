import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 🔹 Basic Info
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // hides password by default in queries
    },

    // 🔹 Subscription Details
    subscriptionPlan: {
      type: String,
      enum: ["free", "pro", "business"],
      default: "free",
    },
    
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "cancelled"],
      default: "inactive",
    },

    // 🔹 Usage Data
    linksCreated: {
      type: Number,
      default: 0,
    },
    totalClicks: {
      type: Number,
      default: 0,
    },

    // 🔹 Role & Permissions
    isAdmin: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
