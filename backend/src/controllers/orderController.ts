import { Request, Response } from "express";
import { Store } from "../models/Store";
import { Product } from "../models/Product";
import { Order, IOrderItem } from "../models/Order";
import { notifyNewOrder } from "../index";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { storeSlug, items, customerName, customerPhone, comment } = req.body;

    if (!storeSlug || !items?.length || !customerName || !customerPhone) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const store = await Store.findOne({ slug: storeSlug, isActive: true });
    if (!store) {
      return res.status(400).json({ message: "Store not found" });
    }

    const productIds = items.map((it: { productId: string }) => it.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const storeKey = storeSlug === "parnavaz" ? "parnavaz" : "lenina";

    const orderItems: IOrderItem[] = [];
    let totalPrice = 0;

    for (const clientItem of items as { productId: string; quantity?: number }[]) {
      const product = products.find(
        (p) => String(p._id) === String(clientItem.productId)
      );
      if (!product) continue;

      const availability = (product.storeAvailability as any)[storeKey];
      const price = availability?.priceOverride ?? product.basePrice;
      const quantity = clientItem.quantity ?? 1;
      const lineTotal = price * quantity;

      totalPrice += lineTotal;

      orderItems.push({
        product: product._id,
        nameSnapshot: product.name,
        priceSnapshot: price,
        quantity,
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

    notifyNewOrder({
      id: populated._id,
      storeSlug,
      customerName,
      customerPhone,
      totalPrice,
      status: populated.status,
      createdAt: populated.createdAt
    });

    res.status(201).json(populated);
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
