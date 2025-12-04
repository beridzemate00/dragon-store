// frontend/src/api/orders.ts
import { api } from "./client";

export type OrderStatus = "new" | "in_progress" | "done" | "cancelled";
export type PaymentMethod = "cash";

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
  customerAddress: string;
  comment?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  createdAt: string;
  items: OrderItemDTO[];
}

export const fetchAdminOrders = async (): Promise<OrderDTO[]> => {
  const res = await api.get("/orders/admin");
  return res.data;
};

export const fetchStaffOrders = async (): Promise<OrderDTO[]> => {
  const res = await api.get("/orders/staff");
  return res.data;
};

export const updateOrderStatusRequest = async (
  id: string,
  status: OrderStatus
): Promise<OrderDTO> => {
  const res = await api.patch(`/orders/${id}/status`, { status });
  return res.data;
};
