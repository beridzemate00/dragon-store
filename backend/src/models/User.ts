import { Schema, model, Document, Types } from "mongoose";

export type UserRole = "ADMIN" | "STAFF" | "CLIENT";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  storeIds: Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "STAFF", "CLIENT"], required: true },
    storeIds: [{ type: Schema.Types.ObjectId, ref: "Store" }]
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
