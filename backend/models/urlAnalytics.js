import mongoose from "mongoose";

const urlAnalyticsSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
      unique: true,
    },

    totalClicks: { type: Number, default: 0 },

    devices: {
      desktop: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 },
    },

    countries: {
      type: Map,
      of: Number,
      default: {},
    },

    sources: {
      direct: { type: Number, default: 0 },
      google: { type: Number, default: 0 },
      twitter: { type: Number, default: 0 },
      facebook: { type: Number, default: 0 },
      others: { type: Number, default: 0 },
    },

    hourlyClicks: {
      type: [Number],
      default: () => Array(24).fill(0),
    },
    
    monthlyClicks: {
      type: Map,
      of: Number, // "2025-09": 123
      default: {},
  },
  },
  { timestamps: true }
);

export default mongoose.model("UrlAnalytics", urlAnalyticsSchema);
