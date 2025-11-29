import { Schema, model, Document, Types } from "mongoose";

export type OrderStatus =
  | "new"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export interface IOrderItem {
  product: Types.ObjectId;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  lineTotal: number;
}

export interface IOrder extends Document {
  store: Types.ObjectId;
  items: IOrderItem[];
  customerName: string;
  customerPhone: string;
  comment?: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    nameSnapshot: { type: String, required: true },
    priceSnapshot: { type: Number, required: true },
    quantity: { type: Number, required: true },
    lineTotal: { type: Number, required: true }
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    items: { type: [orderItemSchema], required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    comment: { type: String },
    status: {
      type: String,
      enum: ["new", "accepted", "preparing", "ready", "completed", "cancelled"],
      default: "new"
    },
    totalPrice: { type: Number, required: true }
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", orderSchema);
