// backend/src/controllers/orderController.ts
import { Request, Response } from "express";
import { Store } from "../models/Store";
import { Product } from "../models/Product";
import { Order } from "../models/Order";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth";

// public: client creates order (cash only + delivery address)
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      storeSlug,
      items,
      customerName,
      customerPhone,
      customerAddress,
      comment
    } = req.body as {
      storeSlug?: string;
      items?: { productId: string; quantity: number }[];
      customerName?: string;
      customerPhone?: string;
      customerAddress?: string;
      comment?: string;
    };

    // basic validation of request body
    if (
      !storeSlug ||
      !items?.length ||
      !customerName ||
      !customerPhone ||
      !customerAddress
    ) {
      return res.status(400).json({ message: "Invalid data" });
    }

    // find active store by slug
    const store = await Store.findOne({ slug: storeSlug, isActive: true });
    if (!store) {
      return res.status(400).json({ message: "Store not found" });
    }

    // load all products used in this order
    const ids = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: ids } });

    // choose availability key by store slug
    const storeKey =
      storeSlug === "parnavaz"
        ? "parnavaz"
        : storeSlug === "konstantine"
        ? "konstantine"
        : "lenina";

    const orderItems: any[] = [];
    let totalPrice = 0;

    // build order items with price snapshots
    for (const clientItem of items) {
      const product = products.find(
        (p) => String(p._id) === String(clientItem.productId)
      );
      if (!product) continue;

      const availability = (product.storeAvailability as any)[storeKey];
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
    const order = await Order.create({
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
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// admin: see all orders (for all stores)
export const getOrdersForAdmin = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const orders = await Order.find()
      .populate("store")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("getOrdersForAdmin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// staff: see orders only for assigned stores
export const getOrdersForStaff = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== "STAFF") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const dbUser = await User.findById(req.user.id);
    if (!dbUser || !dbUser.storeIds?.length) {
      return res.status(403).json({ message: "No stores assigned" });
    }

    const orders = await Order.find({
      store: { $in: dbUser.storeIds }
    })
      .populate("store")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("getOrdersForStaff error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
