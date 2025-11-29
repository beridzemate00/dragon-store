import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../../components/layout/MainNavbar";
import MainFooter from "../../components/layout/MainFooter";
import { useCart } from "../../context/CartContext";
import { api } from "../../api/client";

const CheckoutPage = () => {
  const { items, totalPrice, storeSlug, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!items.length || !storeSlug) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <MainNavbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md px-6 py-4 text-center">
            <p className="text-sm text-slate-600 mb-2">
              Your cart is empty or store is not selected.
            </p>
          </div>
        </main>
        <MainFooter />
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    try {
      setLoading(true);
      const payload = {
        storeSlug,
        customerName,
        customerPhone,
        comment,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      const res = await api.post("/orders", payload);
      clearCart();
      navigate(`/order-success/${res.data._id}`);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <MainNavbar />
      <main className="flex-1">
        <div className="max-w-xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
          <p className="text-sm text-slate-600 mb-4">
            Store: {storeSlug === "lenina" ? "Gamsakhurdia" : "Parnavaz Mepe"}
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-4 rounded-lg border"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                Your name
              </label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone number
              </label>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Comment (optional)
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 text-sm"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="border-t pt-3 text-sm">
              <div className="flex justify-between mb-1">
                <span>Total:</span>
                <span className="font-semibold">
                  {totalPrice.toFixed(2)} ₾
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white rounded-full py-2 text-sm font-semibold disabled:opacity-50"
            >
              {loading ? "Sending order..." : "Place order"}
            </button>
          </form>
        </div>
      </main>
      <MainFooter />
    </div>
  );
};

export default CheckoutPage;
