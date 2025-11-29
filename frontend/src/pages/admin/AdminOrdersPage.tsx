const AdminOrdersPage = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="font-bold">Admin – Orders</h1>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <p className="text-sm text-slate-600">
          Here we will later show all orders with filters by store and status,
          connected to backend and real-time updates.
        </p>
      </main>
    </div>
  );
};

export default AdminOrdersPage;
