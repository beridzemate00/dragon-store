import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { ENV } from "./config/env";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  }
});

// 🔧 Middleware
app.use(cors({ origin: ENV.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// 🔧 Тестовый маршрут
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "dragon-store-backend" });
});

// 🔌 Socket.IO
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Функция, которую потом будем юзать для уведомлений о заказах
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


