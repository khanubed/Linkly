import Url from "../models/url.js";
import User from "../models/user.js";
import shortid from "shortid";
import UrlAnalytics from "../models/urlAnalytics.js";
import geoip from "geoip-lite"; 
import {UAParser} from "ua-parser-js";


export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, userId } = req.body;

    if (!originalUrl || !userId) {
      return res.status(400).json({ success: false, message: "Original URL and user ID are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Limit for free users
    if (user.subscriptionPlan === "free" && user.linksCreated >= 10) {
      return res.status(403).json({
        success: false,
        message: "You have reached the free plan limit. Upgrade to create more links."
      });
    }

    // Check if custom alias already exists
    if (customAlias) {
      const existing = await Url.findOne({ shortUrl: `${customAlias}` });
      if (existing) {
        return res.status(400).json({ success: false, message: "Custom alias already in use" });
      }
    }

    // Generate unique alias if not provided
    const alias = customAlias || shortid.seed(8).generate();
    const shortUrl = `${alias}`;

    // Create new shortened URL
    const newUrl = await Url.create({
      userId,
      originalUrl,
      shortUrl,
      visits: 0,
      clickHistory: [],
      created: new Date(),
    });

    const analytics = await UrlAnalytics.create({
      urlId: newUrl._id,
    });

    // attach analytics to url
    newUrl.analyticsId = analytics._id;

    // Update user's link count
    user.linksCreated += 1;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Short URL created successfully",
      url: newUrl,
      userData : user
    });
  } catch (error) {
    console.error("Error in createShortUrl:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// controllers/url.js




export const redirectShortUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortUrl: shortCode });
    if (!url) return res.status(404).json({ message: "URL not found" });

    const analytics = await UrlAnalytics.findOne({ urlId: url._id });
    if (!analytics) return res.status(404).json({ message: "Analytics missing" });

    url.visits++;
    url.save();

    // ---- BASIC COUNTS ----
    analytics.totalClicks++;

    // Hour
    const hour = new Date().getHours();
    analytics.hourlyClicks[hour]++;

    // Month
    const monthKey = new Date().toISOString().slice(0, 7); // YYYY-MM
    analytics.monthlyClicks.set(
      monthKey,
      (analytics.monthlyClicks.get(monthKey) || 0) + 1
    );

    // Device
    const ua = req.headers["user-agent"] || "";
    if (/mobile/i.test(ua)) analytics.devices.mobile++;
    else if (/tablet/i.test(ua)) analytics.devices.tablet++;
    else analytics.devices.desktop++;

    // Source
    const ref = req.headers.referer || "";
    if (ref.includes("google")) analytics.sources.google++;
    else if (ref.includes("twitter")) analytics.sources.twitter++;
    else if (ref.includes("facebook")) analytics.sources.facebook++;
    else if (!ref) analytics.sources.direct++;
    else analytics.sources.others++;

    // Country (basic version)
    const country = req.headers["x-country"] || "Unknown";
    analytics.countries.set(
      country,
      (analytics.countries.get(country) || 0) + 1
    );

    await analytics.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ message: "Redirect failed" });
  }
};






export const deleteURL = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; // ✅ coming from secureRoute

    // Find URL
    const url = await Url.findById(id);
    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    // Ownership check
    if (url.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Delete URL
    await Url.findByIdAndDelete(id);
    await UrlAnalytics.findOneAndDelete({ urlId: id });

    // Update user count
    const user = await User.findById(userId);
    if (user && user.linksCreated > 0) {
      user.linksCreated -= 1;
      await user.save(); 
    }

    res.json({
      success: true,
      message: "URL deleted successfully",
      userData: user,
    });
  } catch (error) {
    console.error("Delete URL Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const getUserUrls = async (req, res) => {
  try {
    const { userId } = req.params;
    const urls = await Url.find({ userId }).sort({ createdAt: -1 }); // latest first
    res.json({ success: true, urls });
  } catch (error) {
    console.error("Fetch URLs Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch URLs" });
  }
};


export const getUrlAnalyticsProvider = async (req , res) => {
    const analytics = await UrlAnalytics.findOne({ urlId: req.params.urlId });
    res.json({ success: true, analytics });
}


export const getUserAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;

    const urls = await Url.find({ userId }).select("_id");
    if (!urls.length) {
      return res.json({ success: true, analytics: null });
    }

    const analyticsList = await UrlAnalytics.find({
      urlId: { $in: urls.map(u => u._id) }
    });

    res.json({ success: true, analytics: analyticsList });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
