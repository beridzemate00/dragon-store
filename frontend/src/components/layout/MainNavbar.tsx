import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const MainNavbar = () => {
  const location = useLocation();
  const { totalItems } = useCart();

  const isActive = (path: string) =>
    location.pathname === path ? "text-red-600 font-semibold" : "text-slate-700";

  return (
    <header className="border-b bg-white sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">
          Dragon Store
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/store/lenina" className={isActive("/store/lenina")}>
            Store Gamsakhurdia
          </Link>
          <Link to="/store/parnavaz" className={isActive("/store/parnavaz")}>
            Store Parnavaz Mepe
          </Link>
          <Link to="/cart" className="relative text-slate-700">
            Cart
            {totalItems > 0 && (
              <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                {totalItems}
              </span>
            )}
          </Link>
          <Link to="/admin" className="text-slate-500 hover:text-red-500">
            Admin
          </Link>
          <Link to="/staff" className="text-slate-500 hover:text-red-500">
            Staff
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default MainNavbar;
