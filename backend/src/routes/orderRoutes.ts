import express from "express";
import {
  createOrder,
  getOrdersForAdmin,
  getOrdersForStaff
} from "../controllers/orderController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = express.Router();


router.post("/", createOrder);


router.get("/admin", requireAuth, requireRole("ADMIN"), getOrdersForAdmin);

// staff
router.get("/staff", requireAuth, requireRole("STAFF"), getOrdersForStaff);

export default router;
