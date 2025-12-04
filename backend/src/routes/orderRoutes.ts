// backend/src/routes/orderRoutes.ts
import express from "express";
import {
  createOrder,
  getOrdersForAdmin,
  getOrdersForStaff
} from "../controllers/orderController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = express.Router();

// public route: client creates order
router.post("/", createOrder);

// admin route: see all orders
router.get("/admin", requireAuth, requireRole("ADMIN"), getOrdersForAdmin);

// staff route: see only orders for assigned stores
router.get("/staff", requireAuth, requireRole("STAFF"), getOrdersForStaff);

export default router;
