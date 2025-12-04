// frontend/src/pages/public/CheckoutPage.tsx
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../../components/layout/MainNavbar";
import { useCart } from "../../context/CartContext";
import { api } from "../../api/client";

const CheckoutPage = () => {
  // get data from cart context
  const { items, storeSlug,clearCart,} = useCart();
  const navigate = useNavigate();

  // compute total from cart items (try item.price, fallback to product.basePrice)
  const total = items.reduce((sum, item) => {
    const anyItem = item as any;
    const price =
      anyItem.price ??
      anyItem.product?.basePrice ??
      anyItem.product?.price ??
      0;
    return sum + price * item.quantity;
  }, 0);

  // local form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // send order to backend
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!storeSlug || items.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const res = await api.post("/orders", {
        storeSlug,
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        comment,
        items: items.map((i) => ({
          // use item.productId if exists, otherwise product._id
          productId: (i as any).productId ?? (i as any).product?._id,
          quantity: i.quantity
        }))
      });

      // clear cart and redirect to success page
            clearCart();
            navigate(`/order-success/${res.data._id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />
      <main className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold mb-4">Checkout</h1>

        {items.length === 0 && (
          <p className="text-sm text-slate-500">
            Cart is empty. Add products first.
          </p>
        )}

        {items.length > 0 && (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* customer name */}
            <div>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* customer phone */}
            <div>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* delivery address */}
            <div>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            {/* optional comment */}
            <div>
              <textarea
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Comment (optional)"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <p className="text-sm">
              Payment: <span className="font-semibold">Cash only</span>
            </p>

            <p className="text-sm">
              Total: <span className="font-semibold">{total.toFixed(2)} ₾</span>
            </p>

            {error && (
              <p className="text-xs text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white rounded-full py-2 text-sm font-semibold disabled:opacity-50"
            >
              {loading ? "Sending..." : "Place order"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
};

export default CheckoutPage;
