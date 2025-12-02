// frontend/src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/public/HomePage";
import StoreCatalogPage from "./pages/public/StoreCatalogPage";
import CartPage from "./pages/public/CartPage";
import CheckoutPage from "./pages/public/CheckoutPage";
import OrderSuccessPage from "./pages/public/OrderSuccessPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import StaffLoginPage from "./pages/staff/StaffLoginPage";
import StaffDashboardPage from "./pages/staff/StaffDashboardPage";
import { useAuth } from "./context/AuthContext";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-4 text-sm">Checking access...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const StaffRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-4 text-sm">Checking access...</div>;
  }

  if (!user) {
    return <Navigate to="/staff/login" replace />;
  }

  if (user.role !== "STAFF") {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public client routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/store/:storeSlug" element={<StoreCatalogPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminOrdersPage />
          </AdminRoute>
        }
      />

      {/* Staff */}
      <Route path="/staff/login" element={<StaffLoginPage />} />
      <Route
        path="/staff"
        element={
          <StaffRoute>
            <StaffDashboardPage />
          </StaffRoute>
        }
      />

      {/* 404 → home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
