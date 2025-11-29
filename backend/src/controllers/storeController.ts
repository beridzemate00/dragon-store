import { Request, Response } from "express";
import { Store } from "../models/Store";

export const getStores = async (_req: Request, res: Response) => {
  try {
    const stores = await Store.find({ isActive: true }).sort({ name: 1 });
    res.json(stores);
  } catch (err) {
    console.error("getStores error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
