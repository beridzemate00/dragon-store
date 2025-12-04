// backend/src/index.ts
import http from "http";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { ENV } from "./config/env";

import authRoutes from "./routes/authRoutes";
import storeRoutes from "./routes/storeRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";

import { errorHandler } from "./middleware/errorHandler";

const app = express();
const server = http.createServer(app);

// Will be initialized after DB connect
let io: Server | null = null;

// Payload for order notifications
export interface NewOrderNotification {
  id: string;
  storeSlug: string;
  customerName: string;
  customerPhone: string;
  totalPrice: number;
  status: string;
  createdAt: Date;
}

// Emit real-time updates to admin/staff panels
export const notifyNewOrder = (order: NewOrderNotification) => {
  if (!io) return;

  // notify staff for specific store
  io.to(`store:${order.storeSlug}`).emit("order:new", order);

  // notify all admins
  io.to("admins").emit("order:new", order);
};

// ============== MIDDLEWARE ==============
app.use(
  cors({
    origin: ENV.CLIENT_ORIGIN, // example: http://localhost:5173
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// ============== ROUTES ==============
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// healthcheck
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Global error handler
app.use(errorHandler);

// ============== START SERVER ==============
const start = async () => {
  try {
    if (!ENV.MONGO_URI) {
      throw new Error("MONGO_URI is not set");
    }

    await mongoose.connect(ENV.MONGO_URI);
    console.log("MongoDB connected");

    const port = ENV.PORT || 5000;

    // Initialize Socket.IO
    io = new Server(server, {
      cors: {
        origin: ENV.CLIENT_ORIGIN,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"]
      }
    });

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      // worker from specific store
      socket.on("joinStoreRoom", (storeSlug: string) => {
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
  } catch (err) {
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
