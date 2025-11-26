import { Router } from "express";
import { login, me } from "../controllers/authController";
import { authRequired } from "../middleware/auth";

const router = Router();

router.post("/login", login);
router.get("/me", authRequired, me);

export default router;
