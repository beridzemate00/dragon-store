"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = void 0;
const Product_1 = require("../models/Product");
// return products, optionally filtered by storeSlug and availability
const getProducts = async (req, res) => {
    try {
        const { storeSlug } = req.query;
        const products = await Product_1.Product.find();
        if (!storeSlug) {
            // no store filter: return all products
            return res.json(products);
        }
        // filter products by availability for given store
        const filtered = products.filter((p) => {
            const availability = p.storeAvailability || {};
            const storeKey = storeSlug === "parnavaz"
                ? "parnavaz"
                : storeSlug === "konstantine"
                    ? "konstantine"
                    : "lenina";
            const entry = availability[storeKey];
            return entry && entry.inStock > 0;
        });
        res.json(filtered);
    }
    catch (err) {
        console.error("getProducts error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getProducts = getProducts;
