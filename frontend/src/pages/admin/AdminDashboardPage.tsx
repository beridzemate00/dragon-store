import { Link } from "react-router-dom";

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="font-bold">Admin – Dragon Store</h1>
          <nav className="text-sm space-x-3">
            <Link to="/" className="text-slate-500 hover:text-red-500">
              Back to site
            </Link>
            <Link to="/admin/orders" className="text-slate-700 hover:text-red-500">
              Orders
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-3">Dashboard</h2>
        <p className="text-sm text-slate-600">
          In the future here will be statistics: daily revenue, orders per
          store, popular products, etc.
        </p>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
