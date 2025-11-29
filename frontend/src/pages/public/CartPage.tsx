import { Link, useNavigate } from "react-router-dom";
import MainNavbar from "../../components/layout/MainNavbar";
import MainFooter from "../../components/layout/MainFooter";
import { useCart } from "../../context/CartContext";

const CartPage = () => {
  const { items, totalPrice, removeItem, storeSlug } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!items.length) return;
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <MainNavbar />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold mb-4">Cart</h1>

          {!items.length && (
            <p className="text-sm text-slate-600">
              Your cart is empty.{" "}
              <Link to="/store/lenina" className="text-red-500 underline">
                Go to catalog
              </Link>
            </p>
          )}

          {items.length > 0 && (
            <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-white rounded-lg border border-slate-200 p-3 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold text-sm">{item.name}</div>
                      <div className="text-xs text-slate-500">
                        {item.price.toFixed(2)} ₾ / {item.unit}
                      </div>
                      <div className="text-xs text-slate-500">
                        Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm mb-2">
                        {(item.price * item.quantity).toFixed(2)} ₾
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-red-500 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <h2 className="font-semibold mb-2">Summary</h2>
                {storeSlug && (
                  <p className="text-xs text-slate-500 mb-1">
                    Store: {storeSlug === "lenina" ? "Gamsakhurdia" : "Parnavaz Mepe"}
                  </p>
                )}
                <p className="text-sm mb-2">
                  Total:{" "}
                  <span className="font-semibold">
                    {totalPrice.toFixed(2)} ₾
                  </span>
                </p>
                <button
                  onClick={handleCheckout}
                  disabled={!items.length}
                  className="w-full mt-2 bg-red-500 text-white rounded-full py-2 text-sm font-semibold disabled:opacity-50"
                >
                  Go to checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <MainFooter />
    </div>
  );
};

export default CartPage;
