import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import type { StoreSlug } from "../../types";

const MainNavbar = () => {
  const location = useLocation();
  const { totalItems, storeSlug } = useCart();

  // Detect current store by:
  // 1) storeSlug из контекста (если уже выбран)
  // 2) по URL: /store/lenina или /store/parnavaz
  let activeStore: StoreSlug | null = storeSlug;

  if (!activeStore) {
    if (location.pathname.startsWith("/store/lenina")) activeStore = "lenina";
    if (location.pathname.startsWith("/store/parnavaz")) activeStore = "parnavaz";
  }

  const isActive = (path: string) =>
    location.pathname === path ? "text-red-600 font-semibold" : "text-slate-700";

  return (
    <header className="border-b bg-white sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">
          Dragon Store
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {/* If no store selected yet → показываем оба магазина */}
          {!activeStore && (
            <>
              <Link to="/store/lenina" className={isActive("/store/lenina")}>
                Store Gamsakhurdia
              </Link>
              <Link to="/store/parnavaz" className={isActive("/store/parnavaz")}>
                Store Parnavaz Mepe
              </Link>
            </>
          )}

          {/* Если пользователь уже "внутри" конкретного магазина → показываем ТОЛЬКО его */}
          {activeStore === "lenina" && (
            <Link to="/store/lenina" className={isActive("/store/lenina")}>
              Store Gamsakhurdia
            </Link>
          )}

          {activeStore === "parnavaz" && (
            <Link to="/store/parnavaz" className={isActive("/store/parnavaz")}>
              Store Parnavaz Mepe
            </Link>
          )}

          <Link to="/cart" className="relative text-slate-700">
            Cart
            {totalItems > 0 && (
              <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default MainNavbar;
