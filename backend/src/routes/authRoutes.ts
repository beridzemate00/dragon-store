// backend/src/routes/authRoutes.ts
import express from "express";
import { login } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.post("/login", login);

router.get("/me", requireAuth, (req, res) => {
  res.status(501).json({ message: "getMe not implemented in controller" });
});

export default router;
