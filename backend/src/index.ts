import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { ENV } from "./config/env";

import authRoutes from "./routes/authRoutes";
import storeRoutes from "./routes/storeRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  }
});

// middleware
app.use(cors({ origin: ENV.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// health
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "dragon-store-backend" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// socket.io
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinAdmins", () => {
    socket.join("admins");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

export const notifyNewOrder = (payload: unknown) => {
  io.to("admins").emit("newOrder", payload);
};

const start = async () => {
  try {
    if (!ENV.MONGO_URI) {
      throw new Error("MONGO_URI is not set");
    }

    await mongoose.connect(ENV.MONGO_URI);
    console.log("MongoDB connected");

    server.listen(ENV.PORT, () => {
      console.log(`Backend listening on http://localhost:${ENV.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start backend:", err);
    process.exit(1);
  }
};

start();
