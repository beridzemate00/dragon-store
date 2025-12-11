"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStores = void 0;
const Store_1 = require("../models/Store");
const getStores = async (_req, res) => {
    try {
        const stores = await Store_1.Store.find({ isActive: true }).sort({ name: 1 });
        res.json(stores);
    }
    catch (err) {
        console.error("getStores error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getStores = getStores;
