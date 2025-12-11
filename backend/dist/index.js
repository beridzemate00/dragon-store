"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyNewOrder = void 0;
// backend/src/index.ts
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const env_1 = require("./config/env");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const storeRoutes_1 = __importDefault(require("./routes/storeRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Will be initialized after DB connect
let io = null;
// Emit real-time updates to admin/staff panels
const notifyNewOrder = (order) => {
    if (!io)
        return;
    // notify staff for specific store
    io.to(`store:${order.storeSlug}`).emit("order:new", order);
    // notify all admins
    io.to("admins").emit("order:new", order);
};
exports.notifyNewOrder = notifyNewOrder;
// ============== MIDDLEWARE ==============
app.use((0, cors_1.default)({
    origin: env_1.ENV.CLIENT_ORIGIN, // example: http://localhost:5173
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express_1.default.json());
// ============== ROUTES ==============
app.use("/api/auth", authRoutes_1.default);
app.use("/api/stores", storeRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
// healthcheck
app.get("/api/health", (_req, res) => {
    res.json({ ok: true, time: new Date().toISOString() });
});
// Global error handler
app.use(errorHandler_1.errorHandler);
// ============== START SERVER ==============
const start = async () => {
    try {
        if (!env_1.ENV.MONGO_URI) {
            throw new Error("MONGO_URI is not set");
        }
        await mongoose_1.default.connect(env_1.ENV.MONGO_URI);
        console.log("MongoDB connected");
        const port = env_1.ENV.PORT || 5000;
        // Initialize Socket.IO
        io = new socket_io_1.Server(server, {
            cors: {
                origin: env_1.ENV.CLIENT_ORIGIN,
                methods: ["GET", "POST"],
                allowedHeaders: ["Content-Type", "Authorization"]
            }
        });
        io.on("connection", (socket) => {
            console.log("Socket connected:", socket.id);
            // worker from specific store
            socket.on("joinStoreRoom", (storeSlug) => {
                socket.join(`store:${storeSlug}`);
            });
            // admin panel
            socket.on("joinAdmins", () => {
                socket.join("admins");
            });
            socket.on("disconnect", () => {
                console.log("Socket disconnected:", socket.id);
            });
        });
        server.listen(port, () => {
            console.log(`Backend running on http://localhost:${port}`);
        });
    }
    catch (err) {
        console.error("Failed to start backend:", err);
    }
};
// Run server
start();
// Safety for unhandled errors
process.on("unhandledRejection", (reason) => {
    console.error("UnhandledRejection:", reason);
});
process.on("uncaughtException", (err) => {
    console.error("UncaughtException:", err);
});
