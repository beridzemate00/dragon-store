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

// ----- Socket.IO -----
let io: Server | null = null;

// What we send to staff/admin panels when a new order is created
export interface NewOrderNotification {
  id: string;
  storeSlug: string;
  customerName: string;
  customerPhone: string;
  totalPrice: number;
  status: string;
  createdAt: Date;
}

// This function is imported in controllers (e.g. createOrder)
export const notifyNewOrder = (order: NewOrderNotification) => {
  if (!io) return;

  // room for specific store staff
  io.to(`store:${order.storeSlug}`).emit("order:new", order);

  // room for all admins
  io.to("admins").emit("order:new", order);
};

// ----- Middleware -----
app.use(
  cors({
    origin: ENV.CLIENT_ORIGIN,
    credentials: false,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// ----- Routes -----
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Healthcheck
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Error handler (must be after routes)
app.use(errorHandler);

// ----- Start function -----
const start = async () => {
  try {
    if (!ENV.MONGO_URI) {
      throw new Error("MONGO_URI is not set");
    }

    await mongoose.connect(ENV.MONGO_URI);
    console.log("MongoDB connected");

    const port = ENV.PORT || 5000;

    // init Socket.IO AFTER Mongo is ok
    io = new Server(server, {
      cors: {
        origin: ENV.CLIENT_ORIGIN,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"]
      }
    });

    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      // client / staff can join rooms
      socket.on("joinStoreRoom", (storeSlug: string) => {
        socket.join(`store:${storeSlug}`);
      });

      socket.on("joinAdmins", () => {
        socket.join("admins");
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
      });
    });

    server.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start backend:", err);
  }
};

start();

// optional: handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
