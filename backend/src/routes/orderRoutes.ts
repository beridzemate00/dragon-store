import express from "express";
import { requireAuth, requireRole } from "../middleware/auth";

const router = express.Router();

router.get(
  "/admin",
  requireAuth,
  requireRole("ADMIN"),
  getOrdersForAdmin
);

// simple placeholder handler for admin orders - replace with real implementation
async function getOrdersForAdmin(req: express.Request, res: express.Response) {
  try {
    // TODO: fetch orders from the database or service
    res.status(200).json({ orders: [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
}

export default router;
