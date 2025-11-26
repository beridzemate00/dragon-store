import { Router } from "express";
import { getProducts } from "../controllers/productController";

const router = Router();

// public: products for a store, with optional filters
router.get("/", getProducts);

export default router;
