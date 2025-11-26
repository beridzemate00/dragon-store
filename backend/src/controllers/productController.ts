import { Request, Response } from "express";
import { Product } from "../models/Product";
import { Category } from "../models/Category";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { storeSlug, categorySlug, search } = req.query;

    const filter: any = { isActive: true };

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        filter.category = category._id;
      }
    }

    if (search) {
      filter.name = { $regex: String(search), $options: "i" };
    }

    const products = await Product.find(filter).populate("category");

    // compute effective price and stock for a given store
    const store = storeSlug === "parnavaz" ? "parnavaz" : "lenina";

    const mapped = products.map((p) => {
      const availability = (p.storeAvailability as any)[store];
      const inStock = availability?.inStock ?? 0;
      const price = availability?.priceOverride ?? p.basePrice;

      return {
        id: p._id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        category: (p.category as any)?.name ?? null,
        basePrice: p.basePrice,
        unit: p.unit,
        imageName: p.imageName,
        inStock,
        price
      };
    });

    res.json(mapped);
  } catch (err) {
    console.error("getProducts error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
