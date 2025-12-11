"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./config/env");
const Store_1 = require("./models/Store");
const Product_1 = require("./models/Product");
const User_1 = require("./models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const run = async () => {
    if (!env_1.ENV.MONGO_URI)
        throw new Error("MONGO_URI not set");
    await mongoose_1.default.connect(env_1.ENV.MONGO_URI);
    console.log("Mongo connected");
    await Store_1.Store.deleteMany({});
    await Product_1.Product.deleteMany({});
    await User_1.User.deleteMany({});
    const parnavaz = await Store_1.Store.create({
        name: "Dragon Store Parnavaz",
        slug: "parnavaz",
        address: "Parnavaz Mepe, Batumi",
        isActive: true
    });
    const konstantine = await Store_1.Store.create({
        name: "Dragon Store Konstantine",
        slug: "konstantine",
        address: "Konstantine Gamsakhurdia, Batumi",
        isActive: true
    });
    await Product_1.Product.insertMany([
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
    const adminPassword = await bcryptjs_1.default.hash("admin123", 10);
    const staffPassword = await bcryptjs_1.default.hash("staff123", 10);
    await User_1.User.create([
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
            passwordHash: await bcryptjs_1.default.hash("client123", 10),
            role: "CLIENT"
        }
    ]);
    console.log("Seed done");
    await mongoose_1.default.disconnect();
};
run().catch((err) => {
    console.error(err);
    process.exit(1);
});
