import mongoose, { Schema, Document } from "mongoose";

export type OrderStatus = "new" | "in_progress" | "done" | "cancelled";

export interface OrderItem {
  product: mongoose.Types.ObjectId;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderDoc extends Document {
  store: mongoose.Types.ObjectId;
  items: OrderItem[];
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  comment?: string;
  paymentMethod: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    nameSnapshot: { type: String, required: true },
    priceSnapshot: { type: Number, required: true },
    quantity: { type: Number, required: true },
    lineTotal: { type: Number, required: true }
  },
  { _id: false }
);

const OrderSchema = new Schema<OrderDoc>(
  {
    store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    items: { type: [OrderItemSchema], required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },
    comment: { type: String },
    paymentMethod: { type: String, required: true, default: "cash" },
    status: {
      type: String,
      enum: ["new", "in_progress", "done", "cancelled"],
      default: "new"
    },
    totalPrice: { type: Number, required: true }
  },
  { timestamps: true }
);

export const Order = mongoose.model<OrderDoc>("Order", OrderSchema);
