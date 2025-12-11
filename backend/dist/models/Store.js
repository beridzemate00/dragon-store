"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const mongoose_1 = require("mongoose");
const storeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    phone: { type: String },
    workTime: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.Store = (0, mongoose_1.model)("Store", storeSchema);
