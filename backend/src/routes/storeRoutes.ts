import { Router } from "express";
import { getStores } from "../controllers/storeController";

const router = Router();

// public: list of active stores
router.get("/", getStores);

export default router;
