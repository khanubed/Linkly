import express from "express";
import {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getTotalRevenue,
} from "../controllers/admin.js";
import { verifyAdmin } from "../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.get("/users", verifyAdmin, getAllUsers);
adminRouter.put("/user/:id/toggle", verifyAdmin, toggleUserStatus);
adminRouter.delete("/user/:id", verifyAdmin, deleteUser);
adminRouter.get("/revenue", verifyAdmin, getTotalRevenue);

export default adminRouter;