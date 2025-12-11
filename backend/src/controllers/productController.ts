// backend/src/controllers/productController.ts
import { Request, Response } from "express";
import { Product } from "../models/Product";

// return products, optionally filtered by storeSlug and availability
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { storeSlug } = req.query as { storeSlug?: string };

    const products = await Product.find();

    if (!storeSlug) {
      // no store filter: return all products
      return res.json(products);
    }

    // filter products by availability for given store
    const storeKey =
      storeSlug === "parnavaz"
        ? "parnavaz"
        : storeSlug === "konstantine"
          ? "konstantine"
          : null;

    if (!storeKey) {
      return res.json([]);
    }

    const filtered = products
      .filter((p: any) => {
        const availability = p.storeAvailability || {};
        const entry = availability[storeKey];
        return entry && entry.inStock > 0;
      })
      .map((p: any) => {
        const availability = p.storeAvailability || {};
        const entry = availability[storeKey];
        const price = entry?.priceOverride ?? p.basePrice;
        const inStock = entry?.inStock ?? 0;

        return {
          id: p._id.toString(),
          name: p.name,
          slug: p.slug,
          description: p.description,
          category: p.category,
          basePrice: p.basePrice,
          unit: p.unit || "pcs",
          price,
          inStock
        };
      });

    res.json(filtered);
  } catch (err) {
    console.error("getProducts error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
