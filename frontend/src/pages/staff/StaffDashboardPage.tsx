// frontend/src/pages/staff/StaffDashboardPage.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchStaffOrders,
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

const StaffDashboardPage = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["staffOrders"],
    queryFn: fetchStaffOrders
  });

  const mutation = useMutation({
    mutationFn: (params: { id: string; status: OrderStatus }) =>
      updateOrderStatusRequest(params.id, params.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffOrders"] });
    }
  });

  const orders: OrderDTO[] = data ?? [];

  const handleStatusChange = (id: string, status: OrderStatus) => {
    mutation.mutate({ id, status });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">Staff · Orders</h1>
            {user && (
              <p className="text-xs text-slate-500">
                {user.name} · role: {user.role}
              </p>
            )}
          </div>
          <button
            onClick={logout}
            className="text-xs font-semibold px-3 py-1 rounded-full border border-slate-300 hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5">
        {isLoading && (
          <p className="text-sm text-slate-500">Loading your store orders...</p>
        )}
        {isError && (
          <p className="text-sm text-red-500">
            Failed to load orders. Check backend / auth.
          </p>
        )}

        {!isLoading && !isError && orders.length === 0 && (
          <p className="text-sm text-slate-500">No orders yet.</p>
        )}

        {!isLoading && !isError && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border rounded-xl p-3 shadow-sm"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleTimeString()} ·{" "}
                      {order.store?.name ?? "Store"}
                    </p>
                    <p className="text-sm font-semibold">
                      {order.customerName} · {order.customerPhone}
                    </p>
                    <p className="text-xs text-slate-500">
                      {order.customerAddress}
                    </p>
                    {order.comment && (
                      <p className="text-xs text-slate-500 mt-1">
                        Note: {order.comment}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 mt-1">
                      Payment: {order.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {order.totalPrice.toFixed(2)} ₾
                    </p>
                    <div className="mt-1 flex items-center gap-2 justify-end">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusColor[order.status]}`}
                      >
                        {statusLabel[order.status]}
                      </span>
                      <select
                        className="border rounded-md text-[11px] px-1.5 py-0.5"
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
                  </div>
                </div>

                <ul className="mt-2 space-y-0.5">
                  {order.items.map((it, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between text-xs text-slate-700"
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
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffDashboardPage;
