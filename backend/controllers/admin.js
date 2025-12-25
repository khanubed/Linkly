// import { URL } from "url";
import User from "../models/user.js";
import Url from "../models/url.js";
import Payment from "../models/payment.js";
import UrlAnalytics from "../models/urlAnalytics.js";

// Get all users (for Admin Dashboard)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({users:users , success : true});
  } catch (err) {
    res.status(500).json({success:false , message: "Error fetching users", error: err.message });
  }
};

// Toggle user active/suspended
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = user.status === "active" ? "suspended" : "active";
    await user.save();

    res.json({ message: `User ${user.status}`, user , success : true });
  } catch (err) {
    res.status(500).json({ message: "Error toggling user", error: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const urls = await Url.find({ userId });

    const urlIds = urls.map(url => url._id);

    await UrlAnalytics.deleteMany({
      urlId: { $in: urlIds }
    });

    await Url.deleteMany({ userId });

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "User, URLs, and Analytics deleted successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: err.message
    });
  }
};



export const getTotalRevenue = async (req, res) => {
  try {
    const result = await Payment.aggregate([
      {
        $match: { status: "paid" } // only successful payments
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      totalRevenue: result[0]?.totalRevenue || 0,
      totalTransactions: result[0]?.totalTransactions || 0
    });
  } catch (error) {
    console.error("Revenue fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate revenue"
    });
  }
};

