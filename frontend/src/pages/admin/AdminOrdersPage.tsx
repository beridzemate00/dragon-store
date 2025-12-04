// frontend/src/pages/admin/AdminOrdersPage.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminOrders,
  updateOrderStatusRequest,
  type OrderDTO,
  type OrderStatus
} from "../../api/orders";
import { useAuth } from "../../context/AuthContext";

const statusLabel: Record<OrderStatus, string> = {
  new: "New",
  in_progress: "In progress",
  done: "Done",
  cancelled: "Cancelled"
};

const statusColor: Record<OrderStatus, string> = {
  new: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  done: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800"
};

const AdminOrdersPage = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: fetchAdminOrders
  });

  const mutation = useMutation({
    mutationFn: (params: { id: string; status: OrderStatus }) =>
      updateOrderStatusRequest(params.id, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    }
  });

  const orders: OrderDTO[] = data ?? [];

  const handleStatusChange = (id: string, status: OrderStatus) => {
    mutation.mutate({ id, status });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin · Orders</h1>
          <button
            onClick={logout}
            className="text-xs font-semibold px-3 py-1 rounded-full border border-slate-300 hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {isLoading && <p className="text-sm text-slate-500">Loading orders...</p>}
        {isError && (
          <p className="text-sm text-red-500">
            Failed to load orders. Check backend / auth.
          </p>
        )}

        {!isLoading && !isError && orders.length === 0 && (
          <p className="text-sm text-slate-500">No orders yet.</p>
        )}

        {!isLoading && !isError && orders.length > 0 && (
          <div className="overflow-x-auto border rounded-xl bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left">Created</th>
                  <th className="px-3 py-2 text-left">Store</th>
                  <th className="px-3 py-2 text-left">Customer</th>
                  <th className="px-3 py-2 text-left">Total</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Items</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t hover:bg-slate-50/70 align-top"
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="font-medium text-slate-900">
                        {order.store?.name ?? "—"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {order.store?.slug}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm">{order.customerName}</div>
                      <div className="text-xs text-slate-500">
                        {order.customerPhone}
                      </div>
                      <div className="text-xs text-slate-500">
                        {order.customerAddress}
                      </div>
                      {order.comment && (
                        <div className="text-[11px] text-slate-500 mt-1">
                          Note: {order.comment}
                        </div>
                      )}
                      <div className="text-[11px] text-slate-500 mt-1">
                        Payment: {order.paymentMethod}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap font-semibold">
                      {order.totalPrice.toFixed(2)} ₾
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[order.status]}`}
                        >
                          {statusLabel[order.status]}
                        </span>
                        <select
                          className="border rounded-md text-xs px-1.5 py-0.5"
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value as OrderStatus
                            )
                          }
                        >
                          {Object.keys(statusLabel).map((key) => (
                            <option key={key} value={key}>
                              {statusLabel[key as OrderStatus]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <ul className="space-y-0.5">
                        {order.items.map((it, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-slate-700 flex justify-between gap-2"
                          >
                            <span className="truncate">
                              {it.nameSnapshot} × {it.quantity}
                            </span>
                            <span className="whitespace-nowrap">
                              {it.lineTotal.toFixed(2)} ₾
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrdersPage;
