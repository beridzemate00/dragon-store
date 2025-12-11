"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/orderRoutes.ts
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// public route: client creates order
router.post("/", orderController_1.createOrder);
// admin route: see all orders
router.get("/admin", auth_1.requireAuth, (0, auth_1.requireRole)("ADMIN"), orderController_1.getOrdersForAdmin);
// staff route: see only orders for assigned stores
router.get("/staff", auth_1.requireAuth, (0, auth_1.requireRole)("STAFF"), orderController_1.getOrdersForStaff);
exports.default = router;
