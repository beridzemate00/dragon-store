// backend/src/controllers/productController.ts
import { Request, Response } from "express";
import { Product } from "../models/Product";
import { Category } from "../models/Category";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { storeSlug, categorySlug, search } = req.query;

    // base filter – only active products
    const filter: any = { isActive: true };

    // filter by category, if provided
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        filter.category = category._id;
      }
    }

    // search by name, if provided
    if (search) {
      filter.name = { $regex: String(search), $options: "i" };
    }

    // load products with category populated
    const products = await Product.find(filter).populate("category");

    // which store (for price + stock)?
    const store = storeSlug === "parnavaz" ? "parnavaz" : "lenina";

    // map to DTO for frontend
    const mapped = products.map((p: any) => {
      const availability = (p.storeAvailability as any)?.[store];
      const inStock: number = availability?.inStock ?? 0;
      const price: number = availability?.priceOverride ?? p.basePrice;

      return {
        id: p._id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        category: p.category ? (p.category as any).name : null,
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
