import { Router } from "express";
import { createOrder } from "../controllers/orderController";

const router = Router();

// public: create order from customer
router.post("/", createOrder);

export default router;
