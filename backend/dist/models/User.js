"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "STAFF", "CLIENT"], required: true },
    storeIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Store" }]
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);
