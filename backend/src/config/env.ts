import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || "5000",
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173"
};
