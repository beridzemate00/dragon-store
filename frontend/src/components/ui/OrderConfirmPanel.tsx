// frontend/src/components/ui/OrderConfirmPanel.tsx
import { OrderDTO, OrderStatus } from "../../api/orders";

const statusLabel: Record<OrderStatus, string> = {
    new: "New",
    in_progress: "In Progress",
    done: "Done",
    cancelled: "Cancelled"
};

const statusColor: Record<OrderStatus, string> = {
    new: "bg-amber-100 text-amber-800 border-amber-200",
    in_progress: "bg-blue-100 text-blue-800 border-blue-200",
    done: "bg-emerald-100 text-emerald-800 border-emerald-200",
    cancelled: "bg-rose-100 text-rose-800 border-rose-200"
};

interface OrderConfirmPanelProps {
    order: OrderDTO | null;
    onClose: () => void;
    onStatusChange: (id: string, status: OrderStatus) => void;
}

export const OrderConfirmPanel = ({
    order,
    onClose,
    onStatusChange
}: OrderConfirmPanelProps) => {
    if (!order) return null;

    const handleStatusChange = (newStatus: OrderStatus) => {
        onStatusChange(order._id, newStatus);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold">Order Details</h2>
                            <p className="text-sm text-indigo-100 mt-1">
                                {new Date(order.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-colors"
                            aria-label="Close"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Status Badge */}
                    <div className="mb-6">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                            Current Status
                        </label>
                        <span
                            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold border-2 ${statusColor[order.status]}`}
                        >
                            {statusLabel[order.status]}
                        </span>
                    </div>

                    {/* Store Info */}
                    {order.store && (
                        <div className="mb-6">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                                Store
                            </label>
                            <div className="bg-slate-50 rounded-lg p-3">
                                <p className="font-semibold text-slate-900">{order.store.name}</p>
                                <p className="text-sm text-slate-500">{order.store.slug}</p>
                            </div>
                        </div>
                    )}

                    {/* Customer Info */}
                    <div className="mb-6">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                            Customer Information
                        </label>
                        <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-slate-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                <span className="font-semibold text-slate-900">
                                    {order.customerName}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-slate-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                <span className="text-slate-700">{order.customerPhone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-slate-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <span className="text-slate-700">{order.customerAddress}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-slate-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <span className="text-slate-700 capitalize">
                                    {order.paymentMethod}
                                </span>
                            </div>
                            {order.comment && (
                                <div className="mt-3 pt-3 border-t border-slate-200">
                                    <p className="text-xs font-semibold text-slate-500 mb-1">
                                        Note:
                                    </p>
                                    <p className="text-sm text-slate-700 italic">"{order.comment}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                            Order Items
                        </label>
                        <div className="bg-slate-50 rounded-lg overflow-hidden">
                            <ul className="divide-y divide-slate-200">
                                {order.items.map((item, idx) => (
                                    <li key={idx} className="p-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {item.nameSnapshot}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {item.priceSnapshot.toFixed(2)} ₾ × {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-slate-900">
                                            {item.lineTotal.toFixed(2)} ₾
                                        </p>
                                    </li>
                                ))}
                            </ul>
                            <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-3 border-t-2 border-slate-300">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-700 uppercase">
                                        Total
                                    </span>
                                    <span className="text-xl font-bold text-slate-900">
                                        {order.totalPrice.toFixed(2)} ₾
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - Action Buttons */}
                <div className="border-t bg-slate-50 px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                        {order.status === "new" && (
                            <>
                                <button
                                    onClick={() => handleStatusChange("in_progress")}
                                    className="flex-1 min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md"
                                >
                                    ✓ Accept Order
                                </button>
                                <button
                                    onClick={() => handleStatusChange("cancelled")}
                                    className="flex-1 min-w-[140px] bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md"
                                >
                                    ✕ Cancel Order
                                </button>
                            </>
                        )}

                        {order.status === "in_progress" && (
                            <>
                                <button
                                    onClick={() => handleStatusChange("done")}
                                    className="flex-1 min-w-[140px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md"
                                >
                                    ✓ Mark as Done
                                </button>
                                <button
                                    onClick={() => handleStatusChange("cancelled")}
                                    className="flex-1 min-w-[140px] bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md"
                                >
                                    ✕ Cancel Order
                                </button>
                            </>
                        )}

                        {(order.status === "done" || order.status === "cancelled") && (
                            <div className="flex-1 text-center py-3">
                                <p className="text-sm text-slate-500">
                                    This order is {statusLabel[order.status].toLowerCase()}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            className="flex-1 min-w-[140px] bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
