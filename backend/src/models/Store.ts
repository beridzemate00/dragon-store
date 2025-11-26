import { Schema, model, Document } from "mongoose";

export interface IStore extends Document {
  name: string;
  slug: string;
  address: string;
  phone?: string;
  workTime?: string;
  isActive: boolean;
}

const storeSchema = new Schema<IStore>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // "lenina", "parnavaz"
    address: { type: String, required: true },
    phone: { type: String },
    workTime: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Store = model<IStore>("Store", storeSchema);
