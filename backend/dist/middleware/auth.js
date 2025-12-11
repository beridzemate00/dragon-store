"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const User_1 = require("../models/User");
const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.slice("Bearer ".length);
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_SECRET);
        // Fetch full user from database
        const user = await User_1.User.findById(payload.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            storeIds: user.storeIds
        };
        next();
    }
    catch (err) {
        console.error("JWT verify error:", err);
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.requireAuth = requireAuth;
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (req.user.role !== role) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};
exports.requireRole = requireRole;
