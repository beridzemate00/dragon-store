// backend/src/seed.ts
import mongoose from "mongoose";
import { ENV } from "./config/env";
import { Store } from "./models/Store";
import { Category } from "./models/Category";
import { Product } from "./models/Product";

const run = async () => {
  try {
    if (!ENV.MONGO_URI) {
      throw new Error("MONGO_URI is not set");
    }

    await mongoose.connect(ENV.MONGO_URI);
    console.log("MongoDB connected (seed)");

    // optional: чистим всё перед сидом
    await Promise.all([
      Store.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({})
    ]);

    // 1) Stores
    const gamsakhurdia = await Store.create({
      name: "Konstantine Gamsakhurdia",
      slug: "lenina", // slug оставляем "lenina", чтобы не ломать фронт
      address: "Batumi, Konst. Gamsakhurdia st.",
      workTime: "11:00 - 22:00",
      isActive: true
    });

    const parnavaz = await Store.create({
      name: "Parnavaz Mepe",
      slug: "parnavaz",
      address: "Batumi, Parnavaz Mepe st.",
      workTime: "11:00 - 22:00",
      isActive: true
    });

    console.log("Stores created:", gamsakhurdia.name, parnavaz.name);

    // 2) Categories
    const noodles = await Category.create({
      name: "Noodles",
      slug: "noodles",
      sortOrder: 1
    });

    const drinks = await Category.create({
      name: "Drinks",
      slug: "drinks",
      sortOrder: 2
    });

    const snacks = await Category.create({
      name: "Snacks",
      slug: "snacks",
      sortOrder: 3
    });

    console.log("Categories created");

    // 3) Products
    await Product.create([
      {
        name: "Shin Ramyun (spicy)",
        slug: "shin-ramyun-spicy",
        description: "Korean instant noodles, spicy flavor.",
        category: noodles._id,
        basePrice: 5.5,
        unit: "pack",
        isActive: true,
        storeAvailability: {
          lenina: { inStock: 40, priceOverride: 5.5 },
          parnavaz: { inStock: 25, priceOverride: 5.9 }
        }
      },
      {
        name: "Samyang 2x Spicy",
        slug: "samyang-2x-spicy",
        description: "Very hot Korean noodles (2x).",
        category: noodles._id,
        basePrice: 7.0,
        unit: "pack",
        isActive: true,
        storeAvailability: {
          lenina: { inStock: 30, priceOverride: 7.0 },
          parnavaz: { inStock: 15, priceOverride: 7.5 }
        }
      },
      {
        name: "Aloe Vera Drink",
        slug: "aloe-vera-drink",
        description: "Sweet aloe drink, 500ml.",
        category: drinks._id,
        basePrice: 4.0,
        unit: "bottle",
        isActive: true,
        storeAvailability: {
          lenina: { inStock: 50 },
          parnavaz: { inStock: 35 }
        }
      },
      {
        name: "Ramune Soda (Original)",
        slug: "ramune-original",
        description: "Japanese marble soda.",
        category: drinks._id,
        basePrice: 6.0,
        unit: "bottle",
        isActive: true,
        storeAvailability: {
          lenina: { inStock: 20, priceOverride: 6.5 },
          parnavaz: { inStock: 20 }
        }
      },
      {
        name: "Pocky Chocolate",
        slug: "pocky-chocolate",
        description: "Japanese biscuit sticks with chocolate.",
        category: snacks._id,
        basePrice: 5.0,
        unit: "pack",
        isActive: true,
        storeAvailability: {
          lenina: { inStock: 60 },
          parnavaz: { inStock: 40 }
        }
      },
      {
        name: "Wasabi Peas",
        slug: "wasabi-peas",
        description: "Crunchy green peas with wasabi.",
        category: snacks._id,
        basePrice: 4.5,
        unit: "pack",
        isActive: true,
        storeAvailability: {
          lenina: { inStock: 30 },
          parnavaz: { inStock: 30 }
        }
      }
    ]);

    console.log("Products created");

    await mongoose.disconnect();
    console.log("MongoDB disconnected (seed finished)");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

run();
