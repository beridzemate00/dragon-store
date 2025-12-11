"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersForStaff = exports.getOrdersForAdmin = exports.createOrder = void 0;
const Store_1 = require("../models/Store");
const Product_1 = require("../models/Product");
const Order_1 = require("../models/Order");
const User_1 = require("../models/User");
// public: client creates order (cash only + delivery address)
const createOrder = async (req, res) => {
    try {
        const { storeSlug, items, customerName, customerPhone, customerAddress, comment } = req.body;
        // basic validation of request body
        if (!storeSlug ||
            !items?.length ||
            !customerName ||
            !customerPhone ||
            !customerAddress) {
            return res.status(400).json({ message: "Invalid data" });
        }
        // find active store by slug
        const store = await Store_1.Store.findOne({ slug: storeSlug, isActive: true });
        if (!store) {
            return res.status(400).json({ message: "Store not found" });
        }
        // load all products used in this order
        const ids = items.map((i) => i.productId);
        const products = await Product_1.Product.find({ _id: { $in: ids } });
        // choose availability key by store slug
        const storeKey = storeSlug === "parnavaz"
            ? "parnavaz"
            : storeSlug === "konstantine"
                ? "konstantine"
                : "lenina";
        const orderItems = [];
        let totalPrice = 0;
        // build order items with price snapshots
        for (const clientItem of items) {
            const product = products.find((p) => String(p._id) === String(clientItem.productId));
            if (!product)
                continue;
            const availability = product.storeAvailability[storeKey];
            const price = availability?.priceOverride ?? product.basePrice;
            const qty = clientItem.quantity ?? 1;
            const lineTotal = price * qty;
            totalPrice += lineTotal;
            orderItems.push({
                product: product._id,
                nameSnapshot: product.name,
                priceSnapshot: price,
                quantity: qty,
                lineTotal
            });
        }
        if (!orderItems.length) {
            return res.status(400).json({ message: "No valid items" });
        }
        // create order document
        const order = await Order_1.Order.create({
            store: store._id,
            items: orderItems,
            customerName,
            customerPhone,
            customerAddress,
            comment,
            status: "new",
            paymentMethod: "cash",
            totalPrice
        });
        const populated = await order.populate("store");
        res.status(201).json(populated);
    }
    catch (err) {
        console.error("createOrder error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.createOrder = createOrder;
// admin: see all orders (for all stores)
const getOrdersForAdmin = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const orders = await Order_1.Order.find()
            .populate("store")
            .sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (err) {
        console.error("getOrdersForAdmin error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getOrdersForAdmin = getOrdersForAdmin;
// staff: see orders only for assigned stores
const getOrdersForStaff = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "STAFF") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const dbUser = await User_1.User.findById(req.user.id);
        if (!dbUser || !dbUser.storeIds?.length) {
            return res.status(403).json({ message: "No stores assigned" });
        }
        const orders = await Order_1.Order.find({
            store: { $in: dbUser.storeIds }
        })
            .populate("store")
            .sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (err) {
        console.error("getOrdersForStaff error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getOrdersForStaff = getOrdersForStaff;
