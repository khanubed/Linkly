import express from "express"
import { getUrlAnalyticsProvider, createShortUrl, deleteURL, getUserAnalytics, getUserUrls, redirectShortUrl } from "../controllers/url.js";
import { secureRoute } from "../middleware/auth.js";

const urlRouter = express.Router();

urlRouter.post("/shorten/" , createShortUrl)
urlRouter.get("/user/:userId", getUserUrls);
urlRouter.get("/resolve/:shortCode",redirectShortUrl);
urlRouter.delete("/:id" , secureRoute , deleteURL)
urlRouter.get("/analytics/url/:urlId", getUrlAnalyticsProvider)
urlRouter.get("/analytics/user/:userId", secureRoute, getUserAnalytics);

export default urlRouter    