import { api } from "./client";

export type OrderStatus = "new" | "in_progress" | "done" | "cancelled";

export interface OrderItemDTO {
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderDTO {
  _id: string;
  store: { _id: string; name: string; slug: string };
  customerName: string;
  customerPhone: string;
  comment?: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  items: OrderItemDTO[];
}

export const fetchAdminOrders = async () => {
  const res = await api.get("/orders/admin");
  return res.data;
};

export const fetchStaffOrders = async () => {
  const res = await api.get("/orders/staff");
  return res.data;
};

export const updateOrderStatusRequest = async (id: string, status: OrderStatus) => {
  const res = await api.patch(`/orders/${id}/status`, { status });
  return res.data;
};
