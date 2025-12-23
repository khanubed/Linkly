import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    unique: true,
    required: true,
  },
  visits: {
    type: Number,
    default: 0,
  },
  analyticsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UrlAnalytics",
  },
}, { timestamps: true });

export default mongoose.model("Url", urlSchema);


