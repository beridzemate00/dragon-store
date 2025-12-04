import { Request, Response } from "express";
import { Store } from "../models/Store";
import { Product } from "../models/Product";
import { Order, OrderStatus } from "../models/Order";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth";

// клиент создаёт заказ
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { storeSlug, items, customerName, customerPhone, comment } = req.body as {
      storeSlug?: string;
      items?: { productId: string; quantity: number }[];
      customerName?: string;
      customerPhone?: string;
      comment?: string;
    };

    if (!storeSlug || !items?.length || !customerName || !customerPhone) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const store = await Store.findOne({ slug: storeSlug, isActive: true });
    if (!store) {
      return res.status(400).json({ message: "Store not found" });
    }

    // загружаем продукты
    const ids = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: ids } });

    const storeKey =
      storeSlug === "parnavaz" ? "parnavaz" : storeSlug === "konstantine" ? "konstantine" : "lenina";

    const orderItems: any[] = [];
    let totalPrice = 0;

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

    const order = await Order.create({
      store: store._id,
      items: orderItems,
      customerName,
      customerPhone,
      comment,
      status: "new",
      totalPrice
    });

    const populated = await order.populate("store");
    res.status(201).json(populated);
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// админ видит все заказы
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

// staff видит только свои магазины
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
