import mongoose from "mongoose";
import { ENV } from "./config/env";
import { Store } from "./models/Store";
import { Product } from "./models/Product";
import { User } from "./models/User";
import bcrypt from "bcryptjs";

const run = async () => {
  if (!ENV.MONGO_URI) throw new Error("MONGO_URI not set");
  await mongoose.connect(ENV.MONGO_URI);
  console.log("Mongo connected");

  await Store.deleteMany({});
  await Product.deleteMany({});
  await User.deleteMany({});

  const parnavaz = await Store.create({
    name: "Dragon Store Parnavaz",
    slug: "parnavaz",
    address: "Parnavaz Mepe, Batumi",
    isActive: true
  });

  const konstantine = await Store.create({
    name: "Dragon Store Konstantine",
    slug: "konstantine",
    address: "Konstantine Gamsakhurdia, Batumi",
    isActive: true
  });

  await Product.insertMany([
    // Japanese Products
    {
      name: "Instant Ramen (Tonkotsu)",
      slug: "instant-ramen-tonkotsu",
      basePrice: 6.5,
      unit: "pack",
      description: "Rich pork bone broth instant ramen",
      storeAvailability: {
        parnavaz: { inStock: 40 },
        konstantine: { inStock: 30 }
      }
    },
    {
      name: "Pocky Sticks (Chocolate)",
      slug: "pocky-sticks-chocolate",
      basePrice: 4.2,
      unit: "box",
      description: "Classic chocolate covered biscuit sticks",
      storeAvailability: {
        parnavaz: { inStock: 25 },
        konstantine: { inStock: 15 }
      }
    },
    {
      name: "Pocky Sticks (Strawberry)",
      slug: "pocky-sticks-strawberry",
      basePrice: 4.2,
      unit: "box",
      description: "Strawberry flavored biscuit sticks",
      storeAvailability: {
        parnavaz: { inStock: 20 },
        konstantine: { inStock: 18 }
      }
    },
    {
      name: "Ramune Soda",
      slug: "ramune-soda",
      basePrice: 3.5,
      unit: "bottle",
      description: "Traditional Japanese marble soda",
      storeAvailability: {
        parnavaz: { inStock: 35 },
        konstantine: { inStock: 25 }
      }
    },
    {
      name: "Matcha Kit Kat",
      slug: "matcha-kit-kat",
      basePrice: 8.5,
      unit: "pack",
      description: "Green tea flavored chocolate wafers",
      storeAvailability: {
        parnavaz: { inStock: 15 },
        konstantine: { inStock: 10 }
      }
    },
    {
      name: "Mochi Ice Cream",
      slug: "mochi-ice-cream",
      basePrice: 12.0,
      unit: "box",
      description: "Assorted flavored rice cake ice cream",
      storeAvailability: {
        parnavaz: { inStock: 8 },
        konstantine: { inStock: 12 }
      }
    },
    // Korean Products
    {
      name: "Shin Ramyun (Spicy Noodles)",
      slug: "shin-ramyun",
      basePrice: 7.0,
      unit: "pack",
      description: "Korea's #1 spicy instant noodles",
      storeAvailability: {
        parnavaz: { inStock: 50 },
        konstantine: { inStock: 45 }
      }
    },
    {
      name: "Honey Butter Chips",
      slug: "honey-butter-chips",
      basePrice: 5.5,
      unit: "bag",
      description: "Sweet and savory potato chips",
      storeAvailability: {
        parnavaz: { inStock: 30 },
        konstantine: { inStock: 20 }
      }
    },
    {
      name: "Korean Seaweed Snacks",
      slug: "korean-seaweed-snacks",
      basePrice: 3.8,
      unit: "pack",
      description: "Crispy roasted seaweed sheets",
      storeAvailability: {
        parnavaz: { inStock: 40 },
        konstantine: { inStock: 35 }
      }
    },
    {
      name: "Gochujang Sauce",
      slug: "gochujang-sauce",
      basePrice: 9.5,
      unit: "jar",
      description: "Korean red chili paste",
      storeAvailability: {
        parnavaz: { inStock: 15 },
        konstantine: { inStock: 12 }
      }
    },
    // Chinese Products
    {
      name: "White Rabbit Candy",
      slug: "white-rabbit-candy",
      basePrice: 4.0,
      unit: "bag",
      description: "Classic Chinese milk candy",
      storeAvailability: {
        parnavaz: { inStock: 25 },
        konstantine: { inStock: 20 }
      }
    },
    {
      name: "Haw Flakes",
      slug: "haw-flakes",
      basePrice: 2.5,
      unit: "pack",
      description: "Sweet hawthorn fruit candy discs",
      storeAvailability: {
        parnavaz: { inStock: 30 },
        konstantine: { inStock: 25 }
      }
    },
    {
      name: "Soy Sauce (Premium)",
      slug: "soy-sauce-premium",
      basePrice: 11.0,
      unit: "bottle",
      description: "Naturally brewed premium soy sauce",
      storeAvailability: {
        parnavaz: { inStock: 20 },
        konstantine: { inStock: 18 }
      }
    },
    {
      name: "Spicy Hot Pot Base",
      slug: "spicy-hot-pot-base",
      basePrice: 10.5,
      unit: "pack",
      description: "Sichuan style hot pot seasoning",
      storeAvailability: {
        parnavaz: { inStock: 12 },
        konstantine: { inStock: 10 }
      }
    },
    // Thai Products
    {
      name: "Thai Rice Crackers",
      slug: "thai-rice-crackers",
      basePrice: 3.2,
      unit: "bag",
      description: "Crispy rice crackers with spices",
      storeAvailability: {
        parnavaz: { inStock: 28 },
        konstantine: { inStock: 22 }
      }
    },
    {
      name: "Sriracha Sauce",
      slug: "sriracha-sauce",
      basePrice: 6.5,
      unit: "bottle",
      description: "Thai hot chili sauce",
      storeAvailability: {
        parnavaz: { inStock: 25 },
        konstantine: { inStock: 20 }
      }
    },
    {
      name: "Thai Tea Mix",
      slug: "thai-tea-mix",
      basePrice: 8.0,
      unit: "bag",
      description: "Authentic Thai tea powder mix",
      storeAvailability: {
        parnavaz: { inStock: 18 },
        konstantine: { inStock: 15 }
      }
    },
    // Vietnamese Products
    {
      name: "Pho Instant Noodles",
      slug: "pho-instant-noodles",
      basePrice: 7.5,
      unit: "pack",
      description: "Vietnamese beef noodle soup",
      storeAvailability: {
        parnavaz: { inStock: 35 },
        konstantine: { inStock: 30 }
      }
    },
    {
      name: "Coffee (Vietnamese Style)",
      slug: "vietnamese-coffee",
      basePrice: 13.5,
      unit: "bag",
      description: "Dark roast ground coffee",
      storeAvailability: {
        parnavaz: { inStock: 10 },
        konstantine: { inStock: 8 }
      }
    },
    {
      name: "Coconut Candy",
      slug: "coconut-candy",
      basePrice: 4.5,
      unit: "bag",
      description: "Sweet and chewy coconut candies",
      storeAvailability: {
        parnavaz: { inStock: 22 },
        konstantine: { inStock: 18 }
      }
    }
  ]);

  const adminPassword = await bcrypt.hash("admin123", 10);
  const staffPassword = await bcrypt.hash("staff123", 10);

  await User.create([
    {
      name: "Admin",
      email: "admin@dragon.local",
      passwordHash: adminPassword,
      role: "ADMIN"
    },
    {
      name: "Staff Parnavaz",
      email: "staff@dragon.local",
      passwordHash: staffPassword,
      role: "STAFF",
      storeIds: [parnavaz._id]
    },
    {
      name: "Client",
      email: "client@shop.com",
      passwordHash: await bcrypt.hash("client123", 10),
      role: "CLIENT"
    }
  ]);

  console.log("Seed done");
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
