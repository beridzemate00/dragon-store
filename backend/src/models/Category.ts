import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  sortOrder: number;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Category = model<ICategory>("Category", categorySchema);
