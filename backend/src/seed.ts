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
    {
      name: "Instant Ramen",
      slug: "instant-ramen",
      basePrice: 6.5,
      storeAvailability: {
        parnavaz: { inStock: 40 },
        konstantine: { inStock: 30 }
      }
    },
    {
      name: "Pocky Sticks",
      slug: "pocky-sticks",
      basePrice: 4.2,
      storeAvailability: {
        parnavaz: { inStock: 25 },
        konstantine: { inStock: 15 }
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
    }
  ]);

  console.log("Seed done");
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
