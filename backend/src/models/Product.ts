// backend/src/models/Product.ts
import mongoose, { Schema, Document } from "mongoose";

export interface StoreAvailabilityEntry {
  inStock: number;
  priceOverride?: number;
}

export interface StoreAvailability {
  parnavaz?: StoreAvailabilityEntry;
  konstantine?: StoreAvailabilityEntry;
  lenina?: StoreAvailabilityEntry;
}

export interface ProductDoc extends Document {
  name: string;
  slug: string;
  basePrice: number;
  unit?: string; // optional unit (e.g. "pcs", "pack")
  description?: string;
  category?: mongoose.Types.ObjectId; // optional reference to Category
  storeAvailability: StoreAvailability; // per-store stock and price override
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<ProductDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    basePrice: { type: Number, required: true },
    unit: { type: String, required: false },
    description: { type: String, required: false },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: false
    },
    storeAvailability: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

export const Product = mongoose.model<ProductDoc>("Product", ProductSchema);
