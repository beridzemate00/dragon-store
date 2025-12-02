import { Schema, model, Document, Types } from "mongoose";

export interface IStoreAvailability {
  inStock: number;
  priceOverride?: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  category: Types.ObjectId;
  basePrice: number;
  unit: string;
  imageName?: string;
  isActive: boolean;
  storeAvailability: {
    lenina?: IStoreAvailability;
    parnavaz?: IStoreAvailability;
  };
}

const storeAvailabilitySchema = new Schema<IStoreAvailability>(
  {
    inStock: { type: Number, default: 0 },
    priceOverride: { type: Number }
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    basePrice: { type: Number, required: true },
    unit: { type: String, required: true },
    imageName: { type: String },
    isActive: { type: Boolean, default: true },
    storeAvailability: {  
      lenina: { type: storeAvailabilitySchema },
      parnavaz: { type: storeAvailabilitySchema }
    }
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", productSchema);
